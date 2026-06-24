import type { FinancingResult, City } from '../types';
import { formatCurrency, formatDateShort } from './calculations';

const SHEETS_URLS: Record<City, string> = {
  duitama: 'https://script.google.com/macros/s/AKfycbyu2RIoneX0rpk1XK92L_LE_X5sGEkYRxGhjCeylvOwAurZism_9UnG-_TDlimG6m9C/exec',
  tunja: 'https://script.google.com/macros/s/AKfycbxQwBTM85Q-VINFLP94ALL2yqQ3yVaacE4PpxK7m4k8vlupe_PGsDbi-m0RNxg70cfX/exec',
  clinica: 'https://script.google.com/macros/s/AKfycbyTe3JqcUFSSTcGX22Bb5Gm_x22nCJ-3F1xkEfJJTEA03KMf6uLOe7UqFZz8lW2raMb/exec',
};

export async function sendToGoogleSheets(result: FinancingResult): Promise<boolean> {
  const url = SHEETS_URLS[result.client.city];
  if (!url) {
    console.warn('Google Sheets URL no configurada para esta sede');
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
    await fetch(url, {
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
