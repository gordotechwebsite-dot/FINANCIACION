import jsPDF from 'jspdf';
import type { FinancingResult } from '../types';
import { formatCurrency, formatDateShort } from './calculations';

export function generatePDF(result: FinancingResult): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Header background
  doc.setFillColor(26, 26, 46);
  doc.rect(0, 0, pageWidth, 50, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('GORDOTECH', pageWidth / 2, 22, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Comercio Tecnologico - Plan de Financiacion', pageWidth / 2, 32, { align: 'center' });

  const today = new Date();
  doc.setFontSize(9);
  doc.text(`Fecha: ${formatDateShort(today)}`, pageWidth / 2, 42, { align: 'center' });

  y = 62;
  doc.setTextColor(26, 26, 46);

  // Client info section
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y - 6, pageWidth - margin * 2, 38, 3, 3, 'F');

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Datos del Cliente', margin + 5, y + 2);
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre: ${result.client.name}`, margin + 5, y);
  doc.text(`Cedula: ${result.client.cedula}`, pageWidth / 2, y);
  y += 7;
  doc.text(`Celular: ${result.client.phone}`, margin + 5, y);
  y += 7;

  // Divider
  y += 8;

  // Trade-in section
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y - 6, pageWidth - margin * 2, 45, 3, 3, 'F');

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Equipo Entregado (Trade-In)', margin + 5, y + 2);
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Modelo: ${result.tradeIn.model}`, margin + 5, y);
  doc.text(`IMEI: ${result.tradeIn.imei}`, pageWidth / 2, y);
  y += 7;
  doc.text(`Estado: ${result.tradeIn.condition}`, margin + 5, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.text(`Valor aceptado: ${formatCurrency(result.tradeIn.acceptedValue)}`, margin + 5, y);
  y += 7;

  // Desired phone section
  y += 8;

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y - 6, pageWidth - margin * 2, 24, 3, 3, 'F');

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Equipo Deseado', margin + 5, y + 2);
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Modelo: ${result.desired.model}`, margin + 5, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`Precio: ${formatCurrency(result.desired.price)}`, pageWidth / 2, y);
  y += 7;

  // Financing summary
  y += 8;

  doc.setFillColor(26, 26, 46);
  doc.roundedRect(margin, y - 6, pageWidth - margin * 2, 42, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen de Financiacion', margin + 5, y + 2);
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const freqLabel = result.config.frequency === 'mensual' ? 'Mensual' : 'Quincenal';
  doc.text(`Saldo a financiar: ${formatCurrency(result.balanceToFinance)}`, margin + 5, y);
  doc.text(`Interes: ${(result.interestRate * 100).toFixed(0)}% (${freqLabel})`, pageWidth / 2, y);
  y += 7;
  doc.text(`Total intereses: ${formatCurrency(result.totalInterest)}`, margin + 5, y);
  doc.text(`Total a pagar: ${formatCurrency(result.totalWithInterest)}`, pageWidth / 2, y);
  y += 7;
  doc.text(`Cuotas: ${result.config.installments} cuotas ${freqLabel.toLowerCase()}es`, margin + 5, y);
  y += 7;

  // Payment schedule table
  y += 10;
  doc.setTextColor(26, 26, 46);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Calendario de Pagos', margin + 5, y);
  y += 8;

  // Table header
  const colX = [margin + 5, margin + 25, margin + 80, margin + 120];
  doc.setFillColor(15, 52, 96);
  doc.roundedRect(margin, y - 5, pageWidth - margin * 2, 8, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('No.', colX[0], y);
  doc.text('Fecha de Pago', colX[1], y);
  doc.text('Valor Cuota', colX[2], y);
  doc.text('Saldo Pendiente', colX[3], y);
  y += 7;

  // Table rows
  doc.setTextColor(26, 26, 46);
  doc.setFont('helvetica', 'normal');

  for (const payment of result.schedule) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    if (payment.number % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 4, pageWidth - margin * 2, 7, 'F');
    }

    doc.text(`${payment.number}`, colX[0], y);
    doc.text(formatDateShort(payment.date), colX[1], y);
    doc.text(formatCurrency(payment.amount), colX[2], y);
    doc.text(formatCurrency(payment.remainingBalance), colX[3], y);
    y += 7;
  }

  // Footer
  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Este documento es un plan de financiacion generado por Gordotech.', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text('Ambas partes se comprometen a cumplir con los terminos aqui establecidos.', pageWidth / 2, y, { align: 'center' });

  // Signature lines
  y += 20;
  doc.setDrawColor(26, 26, 46);
  doc.line(margin + 5, y, margin + 70, y);
  doc.line(pageWidth - margin - 70, y, pageWidth - margin - 5, y);
  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(26, 26, 46);
  doc.text('Firma del Cliente', margin + 20, y);
  doc.text('Firma Gordotech', pageWidth - margin - 55, y);

  const clientName = result.client.name.replace(/\s+/g, '_');
  doc.save(`Financiacion_${clientName}_${formatDateShort(today)}.pdf`);
}
