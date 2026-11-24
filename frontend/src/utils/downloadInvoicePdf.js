import html2pdf from 'html2pdf.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { TaxInvoice } from '../components/invoice/TaxInvoice';

/**
 * Downloads the Enterprise Tax Invoice as a vector-accurate PDF.
 * Mounts the exact <TaxInvoice sale={sale} /> component and executes html2pdf.
 */
export const downloadInvoicePdf = async (sale) => {
  if (!sale) return;

  // Fix html2canvas + Tailwind Preflight baseline bug (`img { display: block }` shifts all text down ~6px)
  const h2cFixStyle = document.createElement('style');
  h2cFixStyle.id = 'h2c-tailwind-baseline-fix';
  h2cFixStyle.innerHTML = `
    img { display: inline !important; }
  `;
  document.head.appendChild(h2cFixStyle);

  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'fixed';
  tempContainer.style.left = '0';
  tempContainer.style.top = '0';
  tempContainer.style.zIndex = '-9999';
  tempContainer.style.opacity = '0';
  tempContainer.style.pointerEvents = 'none';
  tempContainer.style.width = '794px';
  tempContainer.style.backgroundColor = '#ffffff';
  document.body.appendChild(tempContainer);

  try {
    const root = createRoot(tempContainer);
    root.render(React.createElement(TaxInvoice, { sale }));

    // Allow React 18 render and SVG paints to finish
    await new Promise((resolve) => setTimeout(resolve, 400));

    const invoiceEl = tempContainer.querySelector('.enterprise-tax-invoice') || tempContainer;

    const opt = {
      margin: [5, 6, 5, 6],
      filename: `Tax-Invoice-${sale.invoice_number || 'INV-0000'}.pdf`,
      image: { type: 'jpeg', quality: 0.99 },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const cloneFix = clonedDoc.createElement('style');
          cloneFix.innerHTML = 'img { display: inline !important; }';
          clonedDoc.head.appendChild(cloneFix);
          const clonedContainer = clonedDoc.querySelector('.enterprise-tax-invoice')?.parentElement;
          if (clonedContainer) {
            clonedContainer.style.opacity = '1';
            clonedContainer.style.position = 'static';
          }
        }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(invoiceEl).save();

    setTimeout(() => {
      root.unmount();
      if (tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer);
      }
      if (h2cFixStyle.parentNode) {
        h2cFixStyle.parentNode.removeChild(h2cFixStyle);
      }
    }, 500);
  } catch (err) {
    console.error('PDF generation error:', err);
    if (tempContainer.parentNode) {
      tempContainer.parentNode.removeChild(tempContainer);
    }
    if (h2cFixStyle.parentNode) {
      h2cFixStyle.parentNode.removeChild(h2cFixStyle);
    }
  }
};

export default downloadInvoicePdf;
