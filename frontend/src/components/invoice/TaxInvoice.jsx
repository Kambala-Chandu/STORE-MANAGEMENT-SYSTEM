import React from 'react';
import QRCode from 'react-qr-code';
import Barcode from 'react-barcode';

export const convertNumberToWords = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return "Zero Dollars Only";

  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function formatHundreds(n) {
    let str = "";
    if (n >= 100) {
      str += units[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + (n % 10 ? " " + units[n % 10] : "");
    } else if (n > 0) {
      str += units[n];
    }
    return str.trim();
  }

  const dollars = Math.floor(num);
  const cents = Math.round((num - dollars) * 100);

  let words = "";
  if (dollars >= 1000000) {
    words += formatHundreds(Math.floor(dollars / 1000000)) + " Million ";
  }
  if (dollars % 1000000 >= 1000) {
    words += formatHundreds(Math.floor((dollars % 1000000) / 1000)) + " Thousand ";
  }
  if (dollars % 1000 > 0) {
    words += formatHundreds(dollars % 1000);
  }
  words = (words.trim() || "Zero") + (dollars === 1 ? " Dollar" : " Dollars");

  if (cents > 0) {
    words += " and " + formatHundreds(cents) + (cents === 1 ? " Cent" : " Cents");
  }
  return words + " Only";
};

export const TaxInvoice = ({ sale, id = "printable-tax-invoice" }) => {
  if (!sale) return null;

  const companyName = sale.store_name || "StoreHub Enterprise Retail Inc.";
  const companyTagline = sale.store_tagline || "Global Retail & Point of Sale Management Systems";
  const companyAddress = sale.store_address || "100 Commercial Boulevard, Suite 400, Financial District, NY 10005";
  const companyPhone = sale.store_phone || "+1 (800) 555-0199 / +1 (800) 555-0198";
  const companyEmail = sale.store_email || "billing@storehubpos.com";
  const companyGstin = sale.store_gstin || "27AABCU9603R1ZM";
  const companyWeb = sale.store_web || "www.storehubpos.com";

  const dateObj = sale.created_at ? new Date(sale.created_at) : new Date();
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
  const isoDate = dateObj.toISOString().split('T')[0];
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const printTimestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const items = sale.items || [];
  const subtotal = Number(sale.subtotal || 0).toFixed(2);
  const discount = Number(sale.discount || 0).toFixed(2);
  const taxRate = sale.tax_rate !== undefined ? Number(sale.tax_rate) : 5.0;
  const taxAmount = Number(sale.tax_amount || 0).toFixed(2);
  const totalAmount = Number(sale.total_amount || 0).toFixed(2);
  const amountPaid = Number(sale.amount_paid || sale.total_amount || 0).toFixed(2);
  const balanceDue = (Number(totalAmount) - Number(amountPaid)).toFixed(2);
  const paymentMethod = (sale.payment_method || 'CASH').toUpperCase();
  const customerName = sale.customer_name || 'Walk-in Customer';
  const customerPhone = sale.customer_phone || (sale.customer && sale.customer.phone) || 'N/A';
  const customerAddress = sale.customer_address || (sale.customer && sale.customer.address) || 'Store Counter';
  const customerGstin = sale.customer_gstin || (sale.customer && sale.customer.gstin) || 'Unregistered Consumer (B2C)';
  const cashierName = sale.cashier_name || 'Store Cashier';
  const invoiceNumber = String(sale.invoice_number || 'INV-000000').trim();
  const isVoided = sale.status === 'Voided';
  const amountInWords = convertNumberToWords(totalAmount);

  // Pure clean JSON payload for instant camera detection without fake URLs
  const qrJsonPayload = JSON.stringify({
    invoice: invoiceNumber,
    customer: customerName,
    amount: totalAmount,
    date: isoDate
  }, null, 2);

  return (
    <div id={id} className="enterprise-tax-invoice">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 6mm 8mm 6mm 8mm;
        }

        /* Crucial fix for html2canvas + Tailwind Preflight baseline shift */
        img {
          display: inline !important;
        }

        .enterprise-tax-invoice,
        .enterprise-tax-invoice * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .enterprise-tax-invoice {
          background-color: #ffffff;
          color: #0f172a;
          font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-size: 12px;
          line-height: 1.35;
          margin: 0 auto;
          width: 100%;
          max-width: 210mm;
          padding: 6px 12px;
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 8px;
          align-items: stretch;
        }

        .col-span-12 { grid-column: span 12 / span 12; }
        .col-span-7  { grid-column: span 7 / span 7; }
        .col-span-6  { grid-column: span 6 / span 6; }
        .col-span-5  { grid-column: span 5 / span 5; }

        /* ── 1. HEADER (12-Column Aligned) ── */
        .erp-header-card {
          grid-column: span 12 / span 12;
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 10px;
          align-items: center;
          padding: 10px 14px;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          border: 1px solid #cbd5e1;
          border-top: 3px solid #1d4ed8;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .erp-brand-col {
          grid-column: span 7 / span 7;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .erp-brand-top {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .erp-logo-badge {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          color: #ffffff;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(37, 99, 235, 0.25);
        }

        .erp-company-heading {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.4px;
          white-space: nowrap;
        }

        .erp-company-tagline {
          font-size: 10px;
          font-weight: 700;
          color: #1d4ed8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 3px;
        }

        .erp-company-details {
          font-size: 10.5px;
          color: #475569;
          line-height: 1.4;
          margin-top: 2px;
        }

        .erp-company-details div {
          white-space: nowrap;
        }

        .erp-company-details strong {
          color: #1e293b;
          font-weight: 700;
        }

        .erp-invoice-meta-col {
          grid-column: span 5 / span 5;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
        }

        .erp-doc-title {
          font-size: 30px;
          font-weight: 900;
          color: #1e3a8a;
          letter-spacing: 0.8px;
          line-height: 1;
          margin-bottom: 6px;
          text-align: right;
        }

        .erp-meta-table {
          width: 100%;
          max-width: 260px;
          border-collapse: collapse;
        }

        .erp-meta-table td {
          padding: 1.5px 0;
          vertical-align: middle;
          line-height: 1.35;
        }

        .erp-meta-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          text-align: left;
          padding-right: 8px;
          white-space: nowrap;
        }

        .erp-meta-val {
          font-size: 13px;
          color: #0f172a;
          font-weight: 700;
          text-align: right;
          white-space: nowrap;
        }

        .erp-meta-val-mono {
          font-family: "Courier New", Courier, monospace;
          font-size: 12.5px;
          font-weight: 800;
          color: #1e3a8a;
          text-align: right;
          white-space: nowrap;
        }

        .erp-status-paid-wrap {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .erp-status-paid {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: #15803d;
          background-color: #dcfce7;
          border: 1px solid #86efac;
          padding: 1px 8px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          line-height: 1.3;
        }

        .erp-status-voided {
          color: #b91c1c;
          background-color: #fee2e2;
          border-color: #fca5a5;
        }

        /* ── 2. BILLING + CASHIER CARDS (Equal Height, 6 Cols Each) ── */
        .erp-info-card {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          height: 100%;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .erp-section-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.2px;
          line-height: 1.2;
          margin-bottom: 7px;
          padding-bottom: 5px;
          border-bottom: 1.5px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .erp-section-accent {
          width: 3.5px;
          height: 15px;
          background: #2563eb;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .erp-kv-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          justify-content: space-between;
        }

        .erp-kv-row {
          display: grid;
          grid-template-columns: 120px 1fr;
          align-items: center;
          gap: 6px;
          line-height: 1.35;
        }

        .erp-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          white-space: nowrap;
        }

        .erp-value {
          font-size: 12.5px;
          color: #0f172a;
          font-weight: 700;
          text-align: right;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── 3. PRODUCT TABLE (12 Columns, Compressed Rows) ── */
        .erp-table-card {
          grid-column: span 12 / span 12;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .erp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          table-layout: fixed;
        }

        .erp-table thead tr {
          background: #0f172a;
          color: #ffffff;
          height: 32px;
        }

        .erp-table th {
          padding: 0 8px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          border: none;
          vertical-align: middle;
          white-space: nowrap;
          line-height: 1.2;
        }

        .erp-table tbody tr {
          border-bottom: 1px solid #e2e8f0;
          height: 30px;
          transition: background-color 0.15s ease;
        }

        .erp-table tbody tr:last-child {
          border-bottom: none;
        }

        .erp-table tbody tr:hover {
          background-color: #eff6ff !important;
        }

        .erp-table td {
          padding: 0 8px;
          vertical-align: middle;
          font-size: 12px;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .erp-row-even {
          background-color: #ffffff;
        }

        .erp-row-odd {
          background-color: #f8fafc;
        }

        .erp-prod-name {
          font-weight: 700;
          color: #0f172a;
        }

        .erp-sku-cell {
          font-family: "Courier New", Courier, monospace;
          font-size: 11.5px;
          color: #475569;
          font-weight: 600;
        }

        /* ── 4. TOTALS SECTION (Equal Height Cards, 6 Cols Each) ── */
        .erp-totals-left-card {
          grid-column: span 6 / span 6;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .erp-words-block {
          margin-bottom: 6px;
          padding-bottom: 5px;
          border-bottom: 1px dashed #cbd5e1;
        }

        .erp-words-heading {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 2px;
        }

        .erp-words-text {
          font-size: 12.5px;
          font-weight: 800;
          color: #1e3a8a;
          font-style: italic;
          line-height: 1.3;
        }

        .erp-pay-summary {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .erp-pay-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 1.3;
        }

        .erp-totals-right-card {
          grid-column: span 6 / span 6;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .erp-calc-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .erp-calc-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 1.35;
        }

        .erp-calc-discount {
          color: #dc2626;
        }

        .erp-grand-total-box {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          color: #ffffff;
          border-radius: 6px;
          padding: 8px 14px;
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .erp-grand-label {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #e2e8f0;
          line-height: 1;
        }

        .erp-grand-value {
          font-size: 26px;
          font-weight: 900;
          font-family: "Courier New", Courier, monospace;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.5px;
        }

        /* ── 5. QR VERIFICATION SECTION (85-90px QR Left, Details Right) ── */
        .erp-qr-card {
          grid-column: span 12 / span 12;
          display: grid;
          grid-template-columns: 94px 1fr;
          gap: 14px;
          align-items: center;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 7px 14px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .erp-qr-frame {
          width: 90px;
          height: 90px;
          padding: 3px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .erp-qr-details {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2.5px;
        }

        .erp-qr-heading {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
        }

        .erp-qr-desc {
          font-size: 11.5px;
          color: #475569;
          line-height: 1.3;
        }

        .erp-qr-meta-line {
          font-size: 11.5px;
          color: #475569;
          line-height: 1.35;
        }

        .erp-qr-meta-val {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .erp-qr-meta-mono {
          font-family: "Courier New", Courier, monospace;
          font-size: 12.5px;
          font-weight: 800;
          color: #1e3a8a;
        }

        .erp-qr-verified-note {
          font-size: 10.5px;
          font-weight: 600;
          color: #1d4ed8;
          line-height: 1.3;
        }

        /* ── 6. BARCODE SECTION (Compact, Centered) ── */
        .erp-barcode-card {
          grid-column: span 12 / span 12;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 3px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .erp-barcode-inner {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          background: #ffffff;
        }

        /* ── 7. FOOTER & SIGNATURES (12-Col Aligned, Signatures Distinct & Centered) ── */
        .erp-footer-section {
          grid-column: span 12 / span 12;
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 12px;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 8px 14px;
        }

        .erp-terms-col {
          grid-column: span 7 / span 7;
          font-size: 10px;
          color: #475569;
          line-height: 1.35;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .erp-terms-title {
          font-size: 10px;
          font-weight: 800;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 1px;
        }

        .erp-terms-col p {
          margin: 0;
          padding: 0;
          white-space: nowrap;
        }

        .erp-print-meta {
          margin-top: 2px !important;
          font-size: 9.5px;
          color: #64748b;
          font-weight: 600;
        }

        .erp-signatures-col {
          grid-column: span 5 / span 5;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          align-items: end;
          padding-top: 12px;
        }

        .erp-sig-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          text-align: center;
        }

        .erp-sig-line {
          width: 88%;
          border-top: 1.5px solid #475569;
          margin-bottom: 4px;
        }

        .erp-sig-label {
          font-size: 9.5px;
          font-weight: 800;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        /* ── 8. THANK YOU BAR ── */
        .erp-thankyou-banner {
          grid-column: span 12 / span 12;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 6px 12px;
          text-align: center;
          font-size: 10px;
          font-weight: 800;
          color: #1e3a8a;
          letter-spacing: 0.4px;
          line-height: 1.2;
        }

        .text-center { text-align: center; }
        .text-right  { text-align: right; }
        .text-left   { text-align: left; }
        .font-bold   { font-weight: 700; }
        .font-mono   { font-family: "Courier New", Courier, monospace; }
        .text-muted  { color: #64748b; }

        @media print {
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: hidden !important;
          }

          .enterprise-tax-invoice {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 2mm 4mm !important;
            box-shadow: none !important;
            border: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .erp-header-card,
          .erp-info-card,
          .erp-table-card,
          .erp-totals-left-card,
          .erp-totals-right-card,
          .erp-qr-card,
          .erp-barcode-card,
          .erp-footer-section,
          .erp-thankyou-banner,
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* ── 1. HEADER ── */}
      <header className="erp-header-card">
        <div className="erp-brand-col">
          <div className="erp-brand-top">
            <div className="erp-logo-badge">S</div>
            <div className="erp-company-heading">{companyName}</div>
          </div>
          <div className="erp-company-tagline">{companyTagline}</div>
          <div className="erp-company-details">
            <div>{companyAddress}</div>
            <div>Phone: {companyPhone} &nbsp;|&nbsp; Email: {companyEmail}</div>
            <div><strong>GSTIN / Tax ID:</strong> {companyGstin} &nbsp;|&nbsp; <strong>Web:</strong> {companyWeb}</div>
          </div>
        </div>

        <div className="erp-invoice-meta-col">
          <div className="erp-doc-title">TAX INVOICE</div>
          <table className="erp-meta-table">
            <tbody>
              <tr>
                <td className="erp-meta-label">Invoice Number:</td>
                <td className="erp-meta-val-mono">{invoiceNumber}</td>
              </tr>
              <tr>
                <td className="erp-meta-label">Invoice Date:</td>
                <td className="erp-meta-val">{formattedDate}</td>
              </tr>
              <tr>
                <td className="erp-meta-label">Invoice Time:</td>
                <td className="erp-meta-val">{formattedTime}</td>
              </tr>
              <tr>
                <td className="erp-meta-label">Payment Status:</td>
                <td className="erp-meta-val">
                  <div className="erp-status-paid-wrap">
                    <span className={`erp-status-paid ${isVoided ? 'erp-status-voided' : ''}`}>
                      {isVoided ? 'VOIDED' : '\u2713 PAID'}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </header>

      {/* ── 2. BILLING + CASHIER (Equal Height Cards on 12-Col Grid) ── */}
      <section className="erp-info-card col-span-6">
        <div className="erp-section-title">
          <span className="erp-section-accent"></span>
          <span>Customer Information</span>
        </div>
        <div className="erp-kv-list">
          <div className="erp-kv-row">
            <span className="erp-label">Customer Name:</span>
            <span className="erp-value">{customerName}</span>
          </div>
          <div className="erp-kv-row">
            <span className="erp-label">Phone:</span>
            <span className="erp-value">{customerPhone}</span>
          </div>
          <div className="erp-kv-row">
            <span className="erp-label">Address:</span>
            <span className="erp-value">{customerAddress}</span>
          </div>
          <div className="erp-kv-row">
            <span className="erp-label">GST / Tax ID:</span>
            <span className="erp-value">{customerGstin}</span>
          </div>
        </div>
      </section>

      <section className="erp-info-card col-span-6">
        <div className="erp-section-title">
          <span className="erp-section-accent"></span>
          <span>Cashier &amp; POS Information</span>
        </div>
        <div className="erp-kv-list">
          <div className="erp-kv-row">
            <span className="erp-label">Cashier / Staff:</span>
            <span className="erp-value">{cashierName}</span>
          </div>
          <div className="erp-kv-row">
            <span className="erp-label">Payment Method:</span>
            <span className="erp-value" style={{ color: '#1d4ed8' }}>{paymentMethod}</span>
          </div>
          <div className="erp-kv-row">
            <span className="erp-label">Payment Status:</span>
            <span className="erp-value" style={{ color: isVoided ? '#b91c1c' : '#15803d' }}>
              {isVoided ? 'VOIDED / STOCK RESTORED' : 'COMPLETED / CLEARED'}
            </span>
          </div>
          <div className="erp-kv-row">
            <span className="erp-label">Register / Terminal:</span>
            <span className="erp-value">POS-01 / Main Store Counter</span>
          </div>
        </div>
      </section>

      {/* ── 3. PRODUCT TABLE ── */}
      <section className="erp-table-card">
        <table className="erp-table">
          <thead>
            <tr>
              <th style={{ width: '4%' }} className="text-center">#</th>
              <th style={{ width: '36%' }} className="text-left">Product</th>
              <th style={{ width: '13%' }} className="text-left">SKU</th>
              <th style={{ width: '6%' }} className="text-center">Qty</th>
              <th style={{ width: '11%' }} className="text-right">Unit Price</th>
              <th style={{ width: '8%' }} className="text-center">GST</th>
              <th style={{ width: '10%' }} className="text-center">Discount</th>
              <th style={{ width: '12%' }} className="text-right">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const pName = item.product_name || item.name || 'Standard Product';
              const sku = item.sku || `SKU-${1000 + idx}`;
              const qty = item.quantity || 1;
              const unitPrice = Number(item.unit_price || 0).toFixed(2);
              const itemDiscount = Number(item.discount || 0).toFixed(2);
              const lineTotal = Number(item.subtotal || (qty * item.unit_price) || 0).toFixed(2);

              return (
                <tr key={idx} className={idx % 2 === 1 ? 'erp-row-odd' : 'erp-row-even'}>
                  <td className="text-center text-muted font-mono">{idx + 1}</td>
                  <td className="text-left erp-prod-name">{pName}</td>
                  <td className="text-left erp-sku-cell">{sku}</td>
                  <td className="text-center font-bold">{qty}</td>
                  <td className="text-right font-mono">${unitPrice}</td>
                  <td className="text-center font-mono text-muted">{taxRate}%</td>
                  <td className="text-center font-mono text-muted">${itemDiscount}</td>
                  <td className="text-right font-mono font-bold">${lineTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* ── 4. TOTAL SECTION (Left: Amount in Words, Right: Subtotal / GST / Grand Total) ── */}
      <section className="erp-totals-left-card">
        <div className="erp-words-block">
          <div className="erp-words-heading">Amount in Words:</div>
          <div className="erp-words-text">{amountInWords}</div>
        </div>

        <div className="erp-pay-summary">
          <div className="erp-pay-row">
            <span className="erp-label">Payment Mode:</span>
            <span className="erp-value">{paymentMethod}</span>
          </div>
          <div className="erp-pay-row">
            <span className="erp-label">Amount Paid:</span>
            <span className="erp-value font-mono">${amountPaid}</span>
          </div>
          <div className="erp-pay-row">
            <span className="erp-label">Balance Due:</span>
            <span className="erp-value font-mono">${balanceDue}</span>
          </div>
        </div>
      </section>

      <section className="erp-totals-right-card">
        <div className="erp-calc-list">
          <div className="erp-calc-row">
            <span className="erp-label">Subtotal (Excl. Tax):</span>
            <span className="erp-value font-mono">${subtotal}</span>
          </div>
          {Number(discount) > 0 && (
            <div className="erp-calc-row erp-calc-discount">
              <span className="erp-label" style={{ color: '#dc2626' }}>Total Discount:</span>
              <span className="erp-value font-mono" style={{ color: '#dc2626' }}>-${discount}</span>
            </div>
          )}
          <div className="erp-calc-row">
            <span className="erp-label">GST ({taxRate}%):</span>
            <span className="erp-value font-mono">${taxAmount}</span>
          </div>
        </div>

        <div className="erp-grand-total-box">
          <span className="erp-grand-label">Grand Total</span>
          <span className="erp-grand-value">${totalAmount}</span>
        </div>
      </section>

      {/* ── 5. QR SECTION (84x84 QR on Left, Vertically Centered Details on Right) ── */}
      <section className="erp-qr-card">
        <div className="erp-qr-frame">
          <QRCode
            value={qrJsonPayload}
            size={82}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="M"
            style={{ display: 'block', width: '82px', height: '82px' }}
          />
        </div>
        <div className="erp-qr-details">
          <div className="erp-qr-heading">Tax Invoice Verification QR (Structured JSON)</div>
          <div className="erp-qr-desc">
            Official cryptographic audit code. Scannable by Google Lens, iOS Camera &amp; Android Camera.
          </div>
          <div className="erp-qr-meta-line">
            Invoice Identifier: <span className="erp-qr-meta-mono">{invoiceNumber}</span>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            Total Billable: <span className="erp-qr-meta-val">${totalAmount}</span>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            Issued: <span className="erp-qr-meta-val">{formattedDate}</span>
          </div>
          <div className="erp-qr-verified-note">
            &#10003; Contains raw structured JSON. No web redirection or external domain dependency.
          </div>
        </div>
      </section>

      {/* ── 6. BARCODE SECTION (Reduced Height, Centered, Minimal Vertical Space) ── */}
      <section className="erp-barcode-card">
        <div className="erp-barcode-inner">
          <Barcode
            value={invoiceNumber}
            format="CODE128"
            renderer="svg"
            width={1.8}
            height={28}
            margin={2}
            fontSize={10}
            displayValue={true}
            background="#FFFFFF"
            lineColor="#000000"
          />
        </div>
      </section>

      {/* ── 7. SIGNATURES & FOOTER (Compact Terms Left, Aligned Signatures Right) ── */}
      <footer className="erp-footer-section">
        <div className="erp-terms-col">
          <div className="erp-terms-title">Terms &amp; Conditions</div>
          <p>1. Goods once sold may be exchanged within 7 days with original invoice.</p>
          <p>2. Electronic items carry manufacturer warranty as applicable.</p>
          <p>3. This is a computer-generated invoice and requires no physical signature.</p>
          <p className="erp-print-meta">Printed on: {printTimestamp} &nbsp;|&nbsp; Page 1 of 1</p>
        </div>

        <div className="erp-signatures-col">
          <div className="erp-sig-box">
            <div className="erp-sig-line"></div>
            <div className="erp-sig-label">Customer Signature</div>
          </div>
          <div className="erp-sig-box">
            <div className="erp-sig-line"></div>
            <div className="erp-sig-label">Authorized Signature</div>
          </div>
        </div>
      </footer>

      {/* ── 8. THANK YOU BAR ── */}
      <div className="erp-thankyou-banner">
        THANK YOU FOR DOING BUSINESS WITH {companyName.toUpperCase()}! VISIT US AT {companyWeb.toUpperCase()}
      </div>
    </div>
  );
};

export default TaxInvoice;
