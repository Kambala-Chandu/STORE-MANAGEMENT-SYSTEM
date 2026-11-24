import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { getApiErrorMessage } from '../utils/apiError';
import { printReceipt } from '../utils/printReceipt';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  User,
  Printer,
  X,
  Package,
  AlertCircle,
  ScanBarcode,
  ShoppingBag,
} from 'lucide-react';
import { Button, Badge, EmptyState, ErrorBanner, SkeletonCard, Modal, cn } from '../components/ui';

export const POS = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [productPage, setProductPage] = useState(0);
  const [hasNextProductPage, setHasNextProductPage] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(5.0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [error, setError] = useState('');
  const [dataLoading, setDataLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchData = async () => {
    setFetchError('');
    try {
      const [cRes, custRes] = await Promise.all([
        apiClient.get('/categories/', { params: { active_only: true } }),
        apiClient.get('/customers/', {
          params: { active_only: true, search: customerSearch.trim() || undefined, limit: 50 },
        })
      ]);
      setCategories(cRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      console.error('Error fetching POS data:', err);
      setFetchError('Unable to load products or customers. Please try again.');
    } finally {
    }
  };

  const fetchProducts = async () => {
    setDataLoading(true);
    setFetchError('');
    try {
      const response = await apiClient.get('/products/', {
        params: {
          active_only: true,
          search: search.trim() || undefined,
          category_id: selectedCategory || undefined,
          skip: productPage * 60,
          limit: 60,
        },
      });
      setProducts(response.data);
      setHasNextProductPage(response.data.length === 60);
    } catch (err) {
      console.error('Error fetching POS products:', err);
      setFetchError('Unable to load products. Please try again.');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerSearch]);

  useEffect(() => {
    const timer = window.setTimeout(fetchProducts, 250);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategory, productPage]);

  const addToCart = (product) => {
    setError('');
    const existing = cart.find(item => item.product_id === product.id);
    if (existing) {
      if (existing.quantity + 1 > product.quantity) {
        setError(`Insufficient stock for ${product.name}. Max available: ${product.quantity}`);
        return;
      }
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (product.quantity < 1) {
        setError(`Product ${product.name} is out of stock!`);
        return;
      }
      setCart([...cart, {
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        unit_price: product.selling_price,
        max_quantity: product.quantity,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (productId, delta) => {
    setError('');
    setCart(cart.map(item => {
      if (item.product_id === productId) {
        const newQty = item.quantity + delta;
        if (newQty > item.max_quantity) {
          setError(`Insufficient stock. Max available: ${item.max_quantity}`);
          return item;
        }
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscount(0);
    setError('');
  };

  // Financial Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = (taxableAmount * (taxRate / 100));
  const totalAmount = taxableAmount + taxAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty. Please add items to proceed.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = {
        customer_id: selectedCustomer ? selectedCustomer.id : null,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price
        })),
        discount: parseFloat(discount) || 0,
        tax_rate: parseFloat(taxRate) || 0,
        payment_method: paymentMethod,
        notes: 'POS checkout transaction'
      };

      const res = await apiClient.post('/sales/checkout', payload);
      const saleData = res.data;
      setCompletedSale(saleData);
      clearCart();
      fetchProducts(); // Refresh product stock levels
    } catch (err) {
      setError(getApiErrorMessage(err, 'Checkout failed'));
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products;

  return (
    <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6 xl:h-[calc(100vh-6.5rem)] animate-fade-in-up min-w-0">
      <h1 className="sr-only">POS Billing</h1>
      {/* Product Catalog & Search Panel */}
      <div className="xl:col-span-7 flex flex-col xl:h-full xl:overflow-hidden space-y-3 min-w-0">

        {/* Search / Barcode Bar */}
        <div className="shrink-0 bg-surface p-3 rounded-xl border border-border shadow-xs">
          <div className="relative flex items-center gap-2">
            <Search className="w-5 h-5 text-content-subtle shrink-0 ml-1" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setProductPage(0);
              }}
              placeholder="Search by name, SKU, or scan barcode..."
              aria-label="Search products or scan barcode"
              autoFocus
              className="w-full min-w-0 bg-transparent border-none text-body-lg text-content placeholder-content-subtle focus:outline-none py-1.5"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setProductPage(0); }}
                aria-label="Clear search"
                className="shrink-0 text-content-subtle hover:text-content rounded-lg p-2 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1 pl-1 text-caption text-content-subtle">
            <ScanBarcode className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">Tip: focus this field and scan a barcode to add items instantly</span>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="shrink-0 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => { setSelectedCategory(null); setProductPage(0); }}
            className={cn(
              'px-4 py-2 rounded-lg text-caption font-semibold whitespace-nowrap transition-all duration-fast shrink-0 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              selectedCategory === null
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface text-content-muted hover:bg-elevated border border-border'
            )}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setProductPage(0); }}
              className={cn(
                'px-4 py-2 rounded-lg text-caption font-semibold whitespace-nowrap transition-all duration-fast shrink-0 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface text-content-muted hover:bg-elevated border border-border'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 text-caption text-content-muted">
          <Button variant="secondary" size="sm" disabled={productPage === 0}
            onClick={() => setProductPage((page) => Math.max(0, page - 1))}>Previous</Button>
          <span>Product page {productPage + 1}</span>
          <Button variant="secondary" size="sm" disabled={!hasNextProductPage}
            onClick={() => setProductPage((page) => page + 1)}>Next</Button>
        </div>

        {fetchError && (
          <div className="shrink-0">
            <ErrorBanner message={fetchError} onRetry={() => { fetchData(); fetchProducts(); }} />
          </div>
        )}

        {/* Scrollable Product Cards Grid */}
        <div className="flex-1 xl:min-h-0 xl:overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pr-1 scrollbar-thin">
          {dataLoading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={Package}
                title="No products found"
                description="Try a different search term or category filter."
              />
            </div>
          ) : filteredProducts.map(p => {
            const isOutOfStock = p.quantity <= 0;
            const isLowStock = !isOutOfStock && p.quantity <= p.reorder_level;
            return (
              <button
                key={p.id}
                disabled={isOutOfStock}
                onClick={() => addToCart(p)}
                aria-label={isOutOfStock ? `${p.name}, out of stock` : `Add ${p.name} to cart, $${p.selling_price.toFixed(2)}`}
                className={cn(
                  'group relative flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all duration-fast min-w-0 min-h-[44px]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  isOutOfStock
                    ? 'bg-surface/40 border-border opacity-60 cursor-not-allowed'
                    : 'bg-surface border-border hover:border-primary hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0'
                )}
              >
                {isOutOfStock && (
                  <span className="absolute inset-x-0 top-0 flex justify-center">
                    <Badge tone="danger" className="rounded-t-none rounded-b-md text-[10px] px-2 py-0.5">Out of stock</Badge>
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex items-center justify-between text-caption text-content-subtle mb-1 gap-1">
                    <span className="font-mono truncate">{p.sku}</span>
                    <Badge tone={isLowStock ? 'warning' : 'neutral'} className="shrink-0">
                      {p.quantity} {p.unit}
                    </Badge>
                  </div>
                  <h4 className="text-body font-semibold text-content line-clamp-2 leading-snug">{p.name}</h4>
                  <p className="text-caption text-content-subtle mt-1 truncate">{p.category_name || 'General'}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-border flex items-center justify-between gap-2">
                  <span className="text-body-lg font-bold text-success tabular-nums">${p.selling_price.toFixed(2)}</span>
                  {!isOutOfStock && (
                    <span className="flex items-center gap-1 text-caption text-primary-soft font-medium shrink-0 opacity-90 group-hover:opacity-100">
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cart / Checkout Panel */}
      <div className="xl:col-span-5 bg-surface border border-border rounded-2xl p-5 flex flex-col xl:h-full xl:overflow-hidden shadow-lg xl:sticky xl:top-0 min-w-0">

        {/* Header */}
        <div className="shrink-0 pb-3 border-b border-border mb-2">
          <div className="flex items-center justify-between mb-2.5 gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <ShoppingCart className="w-5 h-5 text-primary-soft shrink-0" aria-hidden="true" />
              <h3 className="font-bold text-content text-title truncate">Current Order ({cart.length})</h3>
            </div>
            {cart.length > 0 && (
              <Button variant="ghost" size="sm" icon={Trash2} onClick={clearCart} className="text-danger hover:text-danger shrink-0">
                Clear
              </Button>
            )}
          </div>

          {error && (
            <div className="mb-2 p-2.5 bg-danger-soft border border-danger/30 rounded-lg text-danger text-caption flex items-center gap-2" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0">{error}</span>
            </div>
          )}

          {/* Customer Selector */}
          <div>
            <label htmlFor="pos-customer" className="block text-caption font-semibold uppercase tracking-wider text-content-subtle mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-primary-soft" aria-hidden="true" /> Customer Account
            </label>
            <input
              type="search"
              value={customerSearch}
              onChange={(event) => setCustomerSearch(event.target.value)}
              placeholder="Search customers by name, phone, or email"
              aria-label="Search customers"
              className="mb-2 w-full bg-elevated border border-border rounded-lg py-2 px-3 text-caption text-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <select
              id="pos-customer"
              aria-label="Customer Account"
              value={selectedCustomer ? selectedCustomer.id : ''}
              onChange={(e) => {
                const cId = parseInt(e.target.value);
                setSelectedCustomer(customers.find(c => c.id === cId) || null);
              }}
              className="w-full bg-elevated border border-border rounded-lg py-2.5 px-3 text-body text-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-fast min-h-[44px]"
            >
              <option value="">Walk-in Customer (Guest)</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone || 'No phone'}) - {c.loyalty_points} Points
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 min-h-[12rem] xl:min-h-0 overflow-y-auto space-y-2 pr-1 my-1 scrollbar-thin">
          {cart.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Cart is empty"
              description="Select items from the catalog to add them here"
            />
          ) : (
            cart.map(item => (
              <div
                key={item.product_id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-2.5 bg-elevated border border-border rounded-lg hover:border-border-strong transition-colors duration-fast"
              >
                <div className="min-w-0">
                  <p className="text-caption font-semibold text-content leading-tight line-clamp-1">{item.name}</p>
                  <p className="text-caption text-content-subtle mt-0.5 tabular-nums">${item.unit_price.toFixed(2)} / unit</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-0.5">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.product_id, -1)}
                      className="w-9 h-9 min-w-[36px] rounded-md hover:bg-elevated text-content-muted flex items-center justify-center active:scale-95 transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <span className="text-caption font-bold text-content w-6 text-center tabular-nums" aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.product_id, 1)}
                      className="w-9 h-9 min-w-[36px] rounded-md hover:bg-elevated text-content-muted flex items-center justify-center active:scale-95 transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="w-16 text-right font-bold text-caption text-content tabular-nums shrink-0">
                    ${(item.unit_price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${item.name} from cart`}
                    onClick={() => removeFromCart(item.product_id)}
                    className="w-9 h-9 min-w-[36px] rounded-md text-content-subtle hover:text-danger hover:bg-danger-soft flex items-center justify-center shrink-0 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary & Checkout */}
        <div className="shrink-0 pt-3 border-t border-border space-y-2.5 mt-auto">
          {/* Discount and Tax inputs */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="pos-discount" className="block text-content-subtle text-caption uppercase font-semibold mb-1">Discount ($)</label>
              <input
                id="pos-discount"
                type="number"
                min="0"
                step="0.5"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-elevated border border-border rounded-lg py-2.5 px-2.5 text-caption text-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary tabular-nums min-h-[44px]"
              />
            </div>
            <div>
              <label htmlFor="pos-tax" className="block text-content-subtle text-caption uppercase font-semibold mb-1">Tax Rate (%)</label>
              <input
                id="pos-tax"
                type="number"
                min="0"
                step="0.5"
                value={taxRate}
                onChange={(e) => setTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-elevated border border-border rounded-lg py-2.5 px-2.5 text-caption text-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary tabular-nums min-h-[44px]"
              />
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-1.5 text-caption text-content-muted bg-elevated p-3 rounded-lg border border-border">
            <div className="flex justify-between">
              <span className="text-content-subtle">Subtotal</span>
              <span className="font-semibold text-content tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-warning">
                <span>Discount</span>
                <span className="tabular-nums">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-content-subtle">Tax ({taxRate}%)</span>
              <span className="font-semibold text-content tabular-nums">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-baseline text-content pt-2 mt-1 border-t border-border">
              <span className="text-caption font-semibold uppercase tracking-wider text-content-subtle">Grand Total</span>
              <span className="text-display font-black text-success tabular-nums leading-none">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-4 gap-1.5">
            {['Cash', 'Card', 'UPI', 'Credit'].map(method => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                aria-pressed={paymentMethod === method}
                className={cn(
                  'py-2.5 rounded-lg text-caption font-semibold border transition-all duration-fast min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  paymentMethod === method
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-elevated border-border text-content-muted hover:text-content'
                )}
              >
                {method}
              </button>
            ))}
          </div>

          {/* Complete Sale Button */}
          <Button
            variant="success"
            size="lg"
            icon={CheckCircle}
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            loading={loading}
            className="w-full !py-3.5 !text-body-lg min-h-[52px]"
          >
            {loading ? 'Processing Sale...' : `Complete Sale ($${totalAmount.toFixed(2)})`}
          </Button>
        </div>
      </div>

      {/* Sale Completion Confirmation Modal */}
      <Modal
        open={!!completedSale}
        onClose={() => setCompletedSale(null)}
        size="sm"
        closeOnBackdrop={false}
      >
        {completedSale && (
          <div className="text-content">
            <div className="text-center pb-4 border-b border-border">
              <div className="w-14 h-14 bg-success-soft text-success rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="text-title-lg font-bold text-content">Sale Completed Successfully!</h3>
              <p className="text-caption text-content-subtle mt-1 font-mono">Invoice: {completedSale.invoice_number}</p>
            </div>

            <div className="py-4 space-y-2 text-caption border-b border-border">
              <div className="flex justify-between gap-2 text-content-subtle">
                <span className="shrink-0">Customer:</span>
                <span className="text-content font-medium truncate">{completedSale.customer_name}</span>
              </div>
              <div className="flex justify-between gap-2 text-content-subtle">
                <span className="shrink-0">Payment Method:</span>
                <span className="text-content font-medium uppercase">{completedSale.payment_method}</span>
              </div>
              <div className="flex justify-between gap-2 text-content-subtle">
                <span className="shrink-0">Cashier:</span>
                <span className="text-content font-medium truncate">{completedSale.cashier_name}</span>
              </div>
              <div className="flex justify-between gap-2 text-content-subtle font-bold text-body pt-1">
                <span>Total Amount Paid:</span>
                <span className="text-success tabular-nums">${completedSale.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="secondary" icon={Printer} onClick={() => printReceipt(completedSale)} className="flex-1">
                Print Tax Invoice
              </Button>
              <Button variant="primary" onClick={() => setCompletedSale(null)} className="flex-1">
                Start New Sale
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
