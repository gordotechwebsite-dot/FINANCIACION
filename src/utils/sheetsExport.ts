import type { FinancingResult } from '../types';
import { formatCurrency, formatDateShort } from './calculations';

const SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyu2RIoneX0rpk1XK92L_LE_X5sGEkYRxGhjCeylvOwAurZism_9UnG-_TDlimG6m9C/exec';

export async function sendToGoogleSheets(result: FinancingResult): Promise<boolean> {
  if (!SHEETS_WEBHOOK_URL) {
    console.warn('Google Sheets URL no configurada');
    return false;
  }

  const payload = {
    client: {
      name: result.client.name,
      cedula: result.client.cedula,
      phone: result.client.phone,
    },
    tradeIn: {
      model: result.tradeIn.model,
      imei: result.tradeIn.imei,
      condition: result.tradeIn.condition,
      acceptedValue: formatCurrency(result.tradeIn.acceptedValue),
    },
    desired: {
      model: result.desired.model,
      price: formatCurrency(result.desired.price),
    },
    balanceToFinance: formatCurrency(result.balanceToFinance),
    frequency: result.config.frequency,
    installments: result.config.installments,
    interestRate: `${(result.interestRate * 100).toFixed(0)}%`,
    totalInterest: formatCurrency(result.totalInterest),
    totalWithInterest: formatCurrency(result.totalWithInterest),
    installmentAmount: formatCurrency(Math.round(result.totalWithInterest / result.config.installments)),
    schedule: result.schedule.map((p) => ({
      date: formatDateShort(p.date),
      amount: formatCurrency(p.amount),
    })),
  };

  try {
    await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return true;
  } catch {
    console.error('Error enviando datos a Google Sheets');
    return false;
  }
}
