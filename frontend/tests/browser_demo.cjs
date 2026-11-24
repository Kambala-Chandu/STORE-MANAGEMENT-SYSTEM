const { chromium } = require('playwright');

const WEB_URL = process.env.STORE_BROWSER_WEB_URL;
const API_URL = process.env.STORE_BROWSER_API_URL;
if (!WEB_URL || !API_URL) throw new Error('Browser test URLs are required');

const accounts = {
  Admin: ['browser_admin', 'BrowserAdmin!2026'],
  Manager: ['browser_manager', 'BrowserManager!2026'],
  Cashier: ['browser_cashier', 'BrowserCashier!2026'],
};
const results = [];
const consoleErrors = [];
const consoleWarnings = [];
const failedResponses = [];

const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const record = (name, status, detail = '') => results.push({ name, status, detail });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on('console', (message) => {
    if (message.type() === 'error') {
      const location = message.location();
      const detail = `${message.text()}${location.url ? ` (${location.url})` : ''}`;
      if (location.url?.startsWith('https://fonts.googleapis.com/')) consoleWarnings.push(detail);
      else consoleErrors.push(detail);
    }
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400 && ![401, 403, 409, 422, 501].includes(response.status())) {
      failedResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  const login = async (role) => {
    await page.goto(`${WEB_URL}/login`);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    const [username, password] = accounts[role];
    await page.getByLabel(/username/i).fill(username);
    await page.getByLabel(/^password/i).fill(password);
    await page.getByRole('button', { name: /sign in|login/i }).click();
    await page.waitForURL((url) => url.pathname === '/');
    await page.getByText(role, { exact: true }).first().waitFor();
  };
  const logout = async () => {
    await page.evaluate(() => localStorage.clear());
  };
  const api = async (path, options = {}) => {
    const token = await page.evaluate(() => localStorage.getItem('token'));
    return context.request.fetch(`${API_URL}${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
  };

  try {
    await login('Cashier');
    check(await page.getByRole('link', { name: /POS Terminal/i }).isVisible(), 'Cashier POS link missing');
    check(await page.getByRole('link', { name: /Product Catalog/i }).count() === 0, 'Cashier saw Product Catalog');
    await page.goto(`${WEB_URL}/products`);
    await page.getByText(/Access Restricted/i).waitFor();
    record('Cashier permissions', 'PASS', 'POS allowed; manager catalog denied');

    await logout();
    await login('Manager');
    check(await page.getByRole('link', { name: /Product Catalog/i }).isVisible(), 'Manager catalog link missing');
    check(await page.getByRole('link', { name: /User Directory/i }).count() === 0, 'Manager saw User Directory');
    await page.goto(`${WEB_URL}/users`);
    await page.getByText(/Access Restricted/i).waitFor();
    record('Manager permissions', 'PASS', 'Core management allowed; user administration denied');

    await logout();
    await login('Admin');
    check(await page.getByRole('link', { name: /User Directory/i }).isVisible(), 'Admin user directory missing');
    record('Admin login and permissions', 'PASS');

    await page.getByRole('link', { name: /Product Catalog/i }).click();
    await page.getByRole('button', { name: /New Product/i }).click();
    await page.getByLabel(/Product Name/i).fill('Browser Demo Product');
    await page.getByLabel(/^SKU/i).fill('BROWSER-DEMO-001');
    await page.getByLabel(/Cost Price/i).fill('4');
    await page.getByLabel(/Selling Price/i).fill('10');
    await page.getByLabel(/^Quantity/i).fill('10');
    await page.getByRole('button', { name: /Save|Create/i }).last().click();
    await page.getByLabel('Search all products').fill('BROWSER-DEMO-001');
    await page.getByText('Browser Demo Product').first().waitFor();
    const productResponse = await api('/products/?search=BROWSER-DEMO-001&limit=5');
    const product = (await productResponse.json())[0];
    check(product.quantity === 10, 'Created product quantity was not 10');
    record('Product creation and catalog search', 'PASS');

    await page.getByRole('link', { name: /Purchase Orders/i }).click();
    await page.getByRole('button', { name: /New Inward PO/i }).click();
    await page.getByLabel(/Purchase Workflow/i).selectOption('Ordered');
    await page.getByLabel(/Search purchase products/i).fill('BROWSER-DEMO-001');
    await page.locator('#purchase-form select').last().selectOption(String(product.id));
    await page.locator('#purchase-form input[placeholder="Qty"]').fill('5');
    await page.locator('#purchase-form input[placeholder="Cost"]').fill('6');
    await page.getByRole('button', { name: /Create Order/i }).click();
    await page.getByText('Ordered', { exact: true }).first().waitFor();
    let stock = (await (await api(`/products/${product.id}`)).json()).quantity;
    check(stock === 10, `Ordered purchase changed stock to ${stock}`);
    await page.getByRole('button', { name: /^Receive$/i }).first().click();
    await page.getByText('Received', { exact: true }).first().waitFor();
    stock = (await (await api(`/products/${product.id}`)).json()).quantity;
    check(stock === 15, `Receiving did not change stock once: ${stock}`);
    record('Ordered purchase and receiving', 'PASS', 'Stock 10 → 15 exactly once');

    await page.getByRole('link', { name: /POS Terminal/i }).click();
    await page.getByLabel(/Search products or scan barcode/i).fill('BROWSER-DEMO-001');
    await page.getByRole('button', { name: /Add Browser Demo Product/i }).click();
    await page.getByRole('button', { name: /Complete Sale/i }).click();
    await page.getByText(/Sale Completed Successfully/i).waitFor();
    const invoiceText = await page.getByText(/Invoice:/i).textContent();
    const invoice = invoiceText.split(':').pop().trim();
    const sale = await (await api(`/sales/invoice/${encodeURIComponent(invoice)}`)).json();
    check(sale.total_amount === 10.5, `Unexpected displayed/API total ${sale.total_amount}`);
    stock = (await (await api(`/products/${product.id}`)).json()).quantity;
    check(stock === 14, `POS sale did not reduce stock to 14: ${stock}`);
    record('POS checkout and totals', 'PASS', `Invoice ${invoice}; total 10.50; stock 14`);

    await page.getByRole('button', { name: /Start New Sale/i }).click();
    await page.getByRole('link', { name: /Stock Ledger/i }).click();
    await page.getByRole('button', { name: /Manual Stock Adjustment/i }).click();
    await page.getByLabel(/Select Product/i).selectOption(String(product.id));
    await page.getByLabel(/quantity/i).fill('2');
    await page.getByLabel(/notes/i).fill('Browser checkpoint adjustment');
    await page.getByRole('button', { name: /Apply Adjustment/i }).click();
    await page.getByText('Browser checkpoint adjustment').waitFor();
    stock = (await (await api(`/products/${product.id}`)).json()).quantity;
    check(stock === 16, `Adjustment did not increase stock to 16: ${stock}`);
    record('Stock adjustment and movement', 'PASS');

    await page.getByRole('link', { name: /Sales History/i }).click();
    await page.getByText(invoice).first().click();
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Void Invoice', exact: true }).last().click();
    await page.waitForTimeout(500);
    const voided = await (await api(`/sales/invoice/${encodeURIComponent(invoice)}`)).json();
    check(voided.status === 'Voided', 'Invoice was not retained as Voided');
    stock = (await (await api(`/products/${product.id}`)).json()).quantity;
    check(stock === 17, `Void did not restore stock to 17: ${stock}`);
    const report = await (await api('/reports/sales')).json();
    check(report.total_orders === 0, 'Voided sale remained in reports');
    record('Admin sale void and reports', 'PASS', 'Invoice retained; stock restored; reports exclude void');

    await page.getByRole('link', { name: /Executive Reports/i }).click();
    const today = new Date().toISOString().slice(0, 10);
    await page.getByLabel(/Start date/i).fill(today);
    await page.getByLabel(/End date/i).fill(today);
    await page.getByText(/0 orders settled/i).waitFor();
    record('Report date filtering', 'PASS');

    await page.goto(`${WEB_URL}/verify/${encodeURIComponent(invoice)}`);
    await page.getByText(/Authentic — Voided/i).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    check(await page.getByText('TAX INVOICE', { exact: true }).isVisible(), 'Invoice preview hidden at mobile viewport');
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    check(bodyWidth <= 430, `Blocking horizontal overflow at mobile viewport: ${bodyWidth}px`);
    record('Invoice preview and mobile viewport', 'PASS', `Document width ${bodyWidth}px`);

    await page.setViewportSize({ width: 1440, height: 900 });
    for (let index = 0; index < 30; index += 1) {
      const response = await api('/products/', {
        method: 'POST',
        data: {
          name: `Pagination Product ${String(index).padStart(2, '0')}`,
          sku: `PAGE-${String(index).padStart(3, '0')}`,
          selling_price: 2,
          quantity: 1,
        },
      });
      check(response.ok(), `Could not create pagination product ${index}`);
    }
    await page.goto(`${WEB_URL}/products`);
    const nextButton = page.getByRole('button', { name: 'Next', exact: true });
    await nextButton.waitFor();
    await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).some(
      (button) => button.textContent.trim() === 'Next' && !button.disabled
    ));
    await nextButton.click();
    await page.getByText('Page 2', { exact: true }).waitFor();
    await page.getByText(/Pagination Product/i).first().waitFor();
    record('Product pagination', 'PASS', 'Catalog UI reached server page 2');
  } catch (error) {
    record('Browser checkpoint', 'FAIL', error.stack || error.message);
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify({ results, consoleErrors, consoleWarnings, failedResponses }, null, 2));
  if (results.some((result) => result.status === 'FAIL') || consoleErrors.length || failedResponses.length) {
    process.exitCode = 1;
  }
})();
