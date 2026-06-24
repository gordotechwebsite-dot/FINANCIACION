import jsPDF from 'jspdf';
import type { FinancingResult } from '../types';
import { formatCurrency, formatDateShort } from './calculations';

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function imageToBase64(img: HTMLImageElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/png');
}

const PRIMARY = [26, 26, 46] as const;
const ACCENT = [15, 52, 96] as const;
const GRAY_TEXT = [100, 100, 100] as const;
const LIGHT_BG = [245, 247, 250] as const;
const BORDER = [200, 200, 200] as const;

export async function generatePDF(result: FinancingResult): Promise<void> {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const m = 18;
  const contentW = pw - m * 2;
  let y = 0;

  let logoBase64 = '';
  try {
    const logoUrl = new URL('/logo-gordotech.png', import.meta.url).href;
    const img = await loadImage(logoUrl);
    logoBase64 = imageToBase64(img);
  } catch {
    // continue without logo
  }

  const today = new Date();
  const freqLabel = result.config.frequency === 'mensual' ? 'Mensual' : 'Quincenal';

  // ── HEADER (white background) ──
  y = 12;

  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', m, y - 4, 20, 20);
  }

  const textX = logoBase64 ? m + 26 : m;
  doc.setTextColor(...PRIMARY);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('GORDOTECH', textX, y + 6);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY_TEXT);
  doc.text('Conectando tus sue\u00f1os', textX, y + 13);

  doc.setFontSize(8);
  doc.setTextColor(...GRAY_TEXT);
  doc.text(formatDateShort(today), pw - m, y + 6, { align: 'right' });

  // Thin separator line
  y += 22;
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.5);
  doc.line(m, y, pw - m, y);

  y += 10;

  // ── TITLE ──
  doc.setTextColor(...PRIMARY);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Plan de Financiaci\u00f3n', m, y);
  y += 10;

  // ── CLIENT INFO ──
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY_TEXT);
  const cityLabel = result.client.city.charAt(0).toUpperCase() + result.client.city.slice(1);
  doc.text(`Cliente: ${result.client.name}  |  CC: ${result.client.cedula}  |  Tel: ${result.client.phone}  |  Sede: ${cityLabel}`, m, y);
  y += 10;

  // ── PHONES SIDE BY SIDE ──
  const halfW = (contentW - 6) / 2;

  // Left: Trade-in
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(m, y, halfW, 42, 2, 2, 'S');

  doc.setTextColor(...GRAY_TEXT);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('EQUIPO ENTREGADO', m + 6, y + 8);

  doc.setTextColor(...PRIMARY);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(result.tradeIn.model, m + 6, y + 16);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY_TEXT);
  doc.text(`IMEI: ${result.tradeIn.imei}`, m + 6, y + 23);
  doc.text(`Estado: ${result.tradeIn.condition}`, m + 6, y + 29);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PRIMARY);
  doc.text(formatCurrency(result.tradeIn.acceptedValue), m + 6, y + 38);

  // Right: Desired
  const rx = m + halfW + 6;
  doc.setDrawColor(...BORDER);
  doc.roundedRect(rx, y, halfW, 42, 2, 2, 'S');

  doc.setTextColor(...GRAY_TEXT);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('EQUIPO DESEADO', rx + 6, y + 8);

  doc.setTextColor(...PRIMARY);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(result.desired.model, rx + 6, y + 16);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PRIMARY);
  doc.text(formatCurrency(result.desired.price), rx + 6, y + 38);

  y += 50;

  // ── FINANCING SUMMARY (light border box, no interest info) ──
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(m, y, contentW, 30, 2, 2, 'S');

  const colW = contentW / 3;
  const labels = ['Saldo a Financiar', 'Total a Pagar', 'Cuotas'];
  const values = [
    formatCurrency(result.balanceToFinance),
    formatCurrency(result.totalWithInterest),
    `${result.config.installments} ${freqLabel.toLowerCase()}es`,
  ];

  for (let i = 0; i < 3; i++) {
    const cx = m + colW * i + colW / 2;

    doc.setTextColor(...GRAY_TEXT);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(labels[i], cx, y + 10, { align: 'center' });

    doc.setTextColor(...PRIMARY);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(values[i], cx, y + 20, { align: 'center' });

    if (i < 2) {
      doc.setDrawColor(...BORDER);
      doc.line(m + colW * (i + 1), y + 4, m + colW * (i + 1), y + 26);
    }
  }

  y += 38;

  // ── PAYMENT SCHEDULE TABLE ──
  doc.setTextColor(...PRIMARY);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Plan de Pagos', m, y);
  y += 7;

  const col1 = m + 4;
  const col2 = m + 20;
  const col3 = m + contentW - 70;
  const col4 = m + contentW - 4;
  const rowH = 8;

  // Header row
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(m, y, contentW, rowH, 1.5, 1.5, 'F');
  doc.setTextColor(...PRIMARY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('#', col1, y + 5.5);
  doc.text('Fecha de pago', col2, y + 5.5);
  doc.text('Cuota', col3, y + 5.5, { align: 'right' });
  doc.text('Saldo', col4, y + 5.5, { align: 'right' });
  y += rowH;

  // Data rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  for (const payment of result.schedule) {
    if (y + rowH > ph - 50) {
      doc.addPage();
      y = 20;
    }

    if (payment.number % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(m, y, contentW, rowH, 'F');
    }

    doc.setTextColor(...ACCENT);
    doc.setFont('helvetica', 'bold');
    doc.text(`${payment.number}`, col1, y + 5.5);

    doc.setTextColor(...PRIMARY);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDateShort(payment.date), col2, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(payment.amount), col3, y + 5.5, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    if (payment.remainingBalance === 0) {
      doc.setTextColor(16, 185, 129);
      doc.text('Pagado', col4, y + 5.5, { align: 'right' });
    } else {
      doc.setTextColor(...GRAY_TEXT);
      doc.text(formatCurrency(payment.remainingBalance), col4, y + 5.5, { align: 'right' });
    }

    y += rowH;
  }

  // ── SIGNATURES ──
  y += 24;
  if (y + 30 > ph - 20) {
    doc.addPage();
    y = 40;
  }

  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.3);
  const sigW = 60;
  const sigLeft = m + 10;
  const sigRight = pw - m - sigW - 10;
  doc.line(sigLeft, y, sigLeft + sigW, y);
  doc.line(sigRight, y, sigRight + sigW, y);

  doc.setTextColor(...PRIMARY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Firma del Cliente', sigLeft + sigW / 2, y + 5, { align: 'center' });
  doc.text('Firma Gordotech', sigRight + sigW / 2, y + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...GRAY_TEXT);
  doc.text(result.client.name, sigLeft + sigW / 2, y + 10, { align: 'center' });
  doc.text(`CC ${result.client.cedula}`, sigLeft + sigW / 2, y + 14, { align: 'center' });

  // ── VIGENCIA NOTICE ──
  y += 24;
  if (y + 10 > ph - 20) {
    doc.addPage();
    y = 40;
  }
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GRAY_TEXT);
  doc.text('Este acuerdo tiene una vigencia de 5 d\u00edas a partir de la fecha de generaci\u00f3n del documento.', pw / 2, y, { align: 'center' });

  // ── FOOTER (thin line + text, no dark background) ──
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.line(m, ph - 14, pw - m, ph - 14);
    doc.setTextColor(...GRAY_TEXT);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Gordotech - Conectando tus sue\u00f1os | gordotech.co | Este documento constituye un acuerdo de financiaci\u00f3n', pw / 2, ph - 8, { align: 'center' });
  }

  const clientName = result.client.name.replace(/\s+/g, '_');
  doc.save(`Gordotech_Financiacion_${clientName}.pdf`);
}
