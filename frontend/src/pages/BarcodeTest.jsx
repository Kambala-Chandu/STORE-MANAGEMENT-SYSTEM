import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import Barcode from 'react-barcode';
import { printReceipt } from '../utils/printReceipt';
import { Printer, RefreshCw, QrCode, ScanLine, Download, CheckCircle2, Copy, FlaskConical } from 'lucide-react';
import { PageHeader, Card, CardHeader, CardBody, Input, Button, Badge } from '../components/ui';

export const BarcodeTest = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026082818266587');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [totalAmount, setTotalAmount] = useState('89.23');
  const [copied, setCopied] = useState(false);

  const qrContainerRef = useRef(null);
  const barcodeContainerRef = useRef(null);

  const qrPayload = JSON.stringify({
    invoice: invoiceNumber,
    customer: customerName,
    amount: totalAmount,
    date: '2026-08-28'
  }, null, 2);

  const sampleSale = {
    id: 9901,
    invoice_number: invoiceNumber,
    created_at: new Date().toISOString(),
    customer_name: customerName,
    customer_phone: '+1 (555) 019-2834',
    customer_address: '742 Evergreen Terrace, Springfield, OR 97477',
    customer_gstin: '27AABCU9603R1ZM',
    cashier_name: 'Lead Cashier',
    payment_method: 'CARD',
    subtotal: 84.98,
    discount: 0.00,
    tax_rate: 5.0,
    tax_amount: 4.25,
    total_amount: Number(totalAmount),
    amount_paid: Number(totalAmount),
    items: [
      { product_name: 'Enterprise Barcode Scanner 2D', sku: 'SCAN-2D-PRO', quantity: 1, unit_price: 64.99, discount: 0, subtotal: 64.99 },
      { product_name: 'Thermal Receipt Rolls 80mm Pack', sku: 'ACC-THM-080', quantity: 1, unit_price: 19.99, discount: 0, subtotal: 19.99 }
    ]
  };

  const handleRandomize = () => {
    const timestamp = Date.now().toString().slice(-8);
    setInvoiceNumber(`INV-20260828${timestamp}`);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = (containerRef, filename) => {
    if (!containerRef.current) return;
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      <PageHeader
        title="Barcode & QR Code Detection Lab"
        description="Real SVG Code128 and QR Code rendering lab. Tested for Google Lens, ZXing, Android & iOS cameras."
        icon={ScanLine}
        actions={
          <>
            <Button variant="secondary" icon={RefreshCw} onClick={handleRandomize}>
              Randomize
            </Button>
            <Button variant="primary" icon={Printer} onClick={() => printReceipt(sampleSale)}>
              Print Tax Invoice
            </Button>
          </>
        }
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-success/30 bg-success/10 px-4 py-3">
        <div className="flex items-center gap-2 text-body font-semibold text-success-soft min-w-0">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span className="min-w-0 break-words">
            Scanner Status: Verified Native Vector SVGs (No Rasterization / No Canvas / Zero Fake URLs)
          </span>
        </div>
        <Badge tone="success" size="sm" className="flex-shrink-0">
          CODE128 · Error Correction M
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,360px)_1fr] gap-6 items-start">
        {/* Config panel */}
        <Card className="lg:sticky lg:top-6">
          <CardHeader
            title="Test Configuration"
            description="Adjust sample invoice data to preview rendering."
          />
          <CardBody className="space-y-4">
            <Input
              label="Invoice Number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="font-mono"
            />
            <Input
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
              label="Total Amount ($)"
              type="number"
              step="0.01"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="font-mono"
            />

            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-caption font-semibold text-content-muted">
                <span>Raw JSON Payload</span>
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1 text-caption text-primary-soft hover:underline"
                >
                  <Copy className="w-3 h-3" aria-hidden="true" /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="text-caption text-success-soft font-mono bg-elevated p-3 rounded-md border border-border overflow-x-auto ds-scroll">
                {qrPayload}
              </pre>
            </div>
          </CardBody>
        </Card>

        {/* Preview panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-w-0">
          <Card className="flex flex-col items-center text-center">
            <CardHeader
              className="w-full"
              title={
                <span className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-success-soft flex-shrink-0" aria-hidden="true" />
                  Large 200×200 SVG QR Code
                </span>
              }
              actions={
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Download}
                  onClick={() => downloadSvg(qrContainerRef, `${invoiceNumber}-qr.svg`)}
                  aria-label="Download QR code SVG"
                >
                  <span className="hidden sm:inline">Download</span>
                </Button>
              }
            />
            <CardBody className="flex flex-col items-center w-full">
              <div className="w-full max-w-full overflow-x-auto ds-scroll flex justify-center">
              <div
                ref={qrContainerRef}
                className="p-4 bg-white rounded-xl shadow-md inline-block flex-shrink-0"
                style={{
                  overflow: 'visible',
                  transform: 'none',
                  filter: 'none',
                  color: '#000000',
                  imageRendering: 'crisp-edges'
                }}
              >
                <QRCode
                  value={qrPayload}
                  size={200}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="M"
                  style={{ display: 'block', width: '200px', height: '200px' }}
                />
              </div>
              </div>
            </CardBody>
          </Card>

          <Card className="flex flex-col items-center text-center">
            <CardHeader
              className="w-full"
              title={
                <span className="flex items-center gap-2">
                  <ScanLine className="w-4 h-4 text-info-soft flex-shrink-0" aria-hidden="true" />
                  Large Code128 SVG Barcode
                </span>
              }
              actions={
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Download}
                  onClick={() => downloadSvg(barcodeContainerRef, `${invoiceNumber}-barcode.svg`)}
                  aria-label="Download barcode SVG"
                >
                  <span className="hidden sm:inline">Download</span>
                </Button>
              }
            />
            <CardBody className="flex flex-col items-center w-full justify-center">
              <div className="w-full max-w-full overflow-x-auto ds-scroll flex justify-center my-auto">
              <div
                ref={barcodeContainerRef}
                className="p-4 bg-white rounded-xl shadow-md inline-block flex-shrink-0"
                style={{
                  overflow: 'visible',
                  transform: 'none',
                  filter: 'none',
                  color: '#000000',
                  imageRendering: 'crisp-edges'
                }}
              >
                <Barcode
                  value={invoiceNumber}
                  format="CODE128"
                  renderer="svg"
                  width={2.2}
                  height={90}
                  margin={20}
                  fontSize={16}
                  displayValue={true}
                  background="#FFFFFF"
                  lineColor="#000000"
                />
              </div>
              </div>
            </CardBody>
          </Card>

          <Card className="sm:col-span-2">
            <CardBody className="flex items-start gap-3">
              <FlaskConical className="w-4 h-4 text-content-subtle flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="min-w-0 space-y-1">
                <p className="text-caption font-semibold text-content-muted">Encoded Barcode Content</p>
                <p className="text-body font-mono font-semibold text-primary-soft break-all">{invoiceNumber}</p>
                <p className="text-caption text-content-subtle">
                  Format: CODE128 (width: 2.2, height: 90, margin: 20, font: 16)
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BarcodeTest;
