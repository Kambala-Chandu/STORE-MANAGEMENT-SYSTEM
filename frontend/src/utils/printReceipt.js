import React from 'react';
import { createRoot } from 'react-dom/client';
import { TaxInvoice } from '../components/invoice/TaxInvoice';

/**
 * Isolated Hidden Iframe Enterprise Invoice Printer.
 * 
 * Renders the native React <TaxInvoice /> component directly into the iframe's DOM
 * using React 18 createRoot. Guarantees 100% vector SVG output for both
 * react-qr-code and react-barcode without canvas rasterization.
 */
export const printReceipt = (sale) => {
  if (!sale) return;

  // 1. Remove any previous invoice iframe to avoid DOM accumulation
  const existingFrame = document.getElementById('pos-invoice-print-frame');
  if (existingFrame) {
    try {
      existingFrame.remove();
    } catch (e) {}
  }

  // 2. Create isolated sandboxed hidden iframe
  const printFrame = document.createElement('iframe');
  printFrame.id = 'pos-invoice-print-frame';
  printFrame.setAttribute('aria-hidden', 'true');
  printFrame.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;visibility:hidden;z-index:-1;';

  document.body.appendChild(printFrame);

  try {
    const frameDoc = printFrame.contentDocument || printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${sale.invoice_number || 'INV-000000'}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 6mm 8mm 6mm 8mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  </style>
</head>
<body>
  <div id="invoice-root"></div>
</body>
</html>`);
    frameDoc.close();

    const mountNode = frameDoc.getElementById('invoice-root');
    const root = createRoot(mountNode);
    root.render(React.createElement(TaxInvoice, { sale }));

    const cleanupFrame = () => {
      setTimeout(() => {
        try {
          if (root) {
            root.unmount();
          }
          if (printFrame && printFrame.parentNode) {
            printFrame.parentNode.removeChild(printFrame);
          }
        } catch (err) {}
      }, 1500);
    };

    const triggerPrint = () => {
      try {
        if (!printFrame.contentWindow) return;
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      } catch (err) {
        console.error('Invoice print error:', err);
      } finally {
        cleanupFrame();
      }
    };

    if (printFrame.contentWindow) {
      printFrame.contentWindow.onafterprint = cleanupFrame;
    }

    // Allow full React 18 rendering & SVG geometry calculation before triggering print dialog
    setTimeout(triggerPrint, 450);
  } catch (err) {
    console.error('Invoice generation error:', err);
    try {
      if (printFrame.parentNode) {
        printFrame.parentNode.removeChild(printFrame);
      }
    } catch (e) {}
  }
};

export default printReceipt;
