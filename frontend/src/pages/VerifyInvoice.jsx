import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { TaxInvoice } from '../components/invoice/TaxInvoice';
import { printReceipt } from '../utils/printReceipt';
import { downloadInvoicePdf } from '../utils/downloadInvoicePdf';
import { ShieldCheck, Printer, Download, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button, Badge, Card, CardBody, ErrorState, Skeleton, SkeletonText } from '../components/ui';

export const VerifyInvoice = () => {
  const { invoiceNumber } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get(`/sales/verify/${invoiceNumber}`);
      setSale(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invoice not found or verification failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invoiceNumber) {
      fetchInvoice();
    }
  }, [invoiceNumber]);

  return (
    <div className="min-h-screen bg-background text-content p-4 md:p-8 flex flex-col items-center">
      {/* Top Brand & Actions Bar */}
      <Card className="max-w-4xl w-full mb-6 animate-fade-in">
        <CardBody className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-fg font-bold text-xl shadow-glow shrink-0">
              S
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-body-lg font-bold text-content truncate">Store Invoice</h1>
                {!loading && !error && sale && (
                  <Badge tone={sale.status === 'Voided' ? 'danger' : 'success'} icon={ShieldCheck}>
                    {sale.status === 'Voided' ? 'Voided' : 'Verified for signed-in user'}
                  </Badge>
                )}
              </div>
              <p className="text-caption text-content-subtle font-mono mt-0.5 break-all">ID: {invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button as={Link} to="/sales" variant="secondary" size="sm" icon={ArrowLeft}>
              Back to Store
            </Button>
            {sale && (
              <>
                <Button variant="secondary" size="sm" icon={Printer} onClick={() => printReceipt(sale)}>
                  Print
                </Button>
                <Button variant="primary" size="sm" icon={Download} onClick={() => downloadInvoicePdf(sale)}>
                  Download PDF
                </Button>
              </>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Main Verification Card */}
      {loading ? (
        <Card className="max-w-4xl w-full animate-fade-in">
          <CardBody className="space-y-6">
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <RefreshCw className="w-8 h-8 text-primary-soft animate-spin" aria-hidden="true" />
              <p className="text-body text-content-muted font-medium" role="status">
                Loading invoice from the store system...
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <SkeletonText lines={4} />
              <SkeletonText lines={4} />
            </div>
            <Skeleton className="h-40 w-full" rounded="rounded-lg" />
          </CardBody>
        </Card>
      ) : error ? (
        <Card className="max-w-md w-full animate-fade-in">
          <CardBody>
            <ErrorState
              title="Verification Notice"
              description={error}
              onRetry={fetchInvoice}
              retryLabel="Retry Verification"
            />
          </CardBody>
        </Card>
      ) : (
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-xl overflow-hidden p-2 animate-fade-in-up">
          <TaxInvoice sale={sale} id="verified-tax-invoice-view" />
        </div>
      )}
    </div>
  );
};

export default VerifyInvoice;
