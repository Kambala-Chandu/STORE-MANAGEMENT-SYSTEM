import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';

/* Heavy, less-frequent routes are code-split so the initial payload
   only carries the shell, the dashboard and the register. */
const SalesHistory = lazy(() => import('./pages/SalesHistory').then((m) => ({ default: m.SalesHistory })));
const Products = lazy(() => import('./pages/Products').then((m) => ({ default: m.Products })));
const Categories = lazy(() => import('./pages/Categories').then((m) => ({ default: m.Categories })));
const Suppliers = lazy(() => import('./pages/Suppliers').then((m) => ({ default: m.Suppliers })));
const Customers = lazy(() => import('./pages/Customers').then((m) => ({ default: m.Customers })));
const Inventory = lazy(() => import('./pages/Inventory').then((m) => ({ default: m.Inventory })));
const Purchases = lazy(() => import('./pages/Purchases').then((m) => ({ default: m.Purchases })));
const Reports = lazy(() => import('./pages/Reports').then((m) => ({ default: m.Reports })));
const Users = lazy(() => import('./pages/Users').then((m) => ({ default: m.Users })));
const BarcodeTest = lazy(() => import('./pages/BarcodeTest').then((m) => ({ default: m.BarcodeTest })));
const VerifyInvoice = lazy(() => import('./pages/VerifyInvoice').then((m) => ({ default: m.VerifyInvoice })));
const AuditLogs = lazy(() => import('./pages/AuditLogs').then((m) => ({ default: m.AuditLogs })));
const Backup = lazy(() => import('./pages/Backup').then((m) => ({ default: m.Backup })));

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-strong border-t-primary-soft" />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Public authentication route */}
              <Route path="/login" element={<Login />} />

              {/* Authenticated Workspace */}
              <Route element={<ProtectedRoute />}>
                <Route path="/verify/:invoiceNumber" element={<VerifyInvoice />} />
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/pos" element={<POS />} />
                  <Route path="/sales" element={<SalesHistory />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/barcode-test" element={<BarcodeTest />} />

                  {/* Manager & Admin Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
                    <Route path="/products" element={<Products />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/purchases" element={<Purchases />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/audit" element={<AuditLogs />} />
                  </Route>


                  {/* Admin Only Route */}
                  <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                    <Route path="/users" element={<Users />} />
                    <Route path="/backup" element={<Backup />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
