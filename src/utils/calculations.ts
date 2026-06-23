import { addMonths, addDays } from 'date-fns';
import type {
  PaymentFrequency,
  PaymentScheduleItem,
  FinancingResult,
  ClientData,
  TradeInPhone,
  DesiredPhone,
  FinancingConfig,
} from '../types';

const INTEREST_RATES: Record<PaymentFrequency, number> = {
  mensual: 0.06,
  quincenal: 0.05,
};

const MAX_MONTHS = 6;

export function getMaxInstallments(frequency: PaymentFrequency): number {
  return frequency === 'mensual' ? MAX_MONTHS : MAX_MONTHS * 2;
}

export function getInterestRate(frequency: PaymentFrequency): number {
  return INTEREST_RATES[frequency];
}

function getNextPaymentDate(startDate: Date, index: number, frequency: PaymentFrequency): Date {
  if (frequency === 'mensual') {
    return addMonths(startDate, index);
  }
  return addDays(startDate, index * 15);
}

export function calculateFinancing(
  client: ClientData,
  tradeIn: TradeInPhone,
  desired: DesiredPhone,
  config: FinancingConfig,
): FinancingResult {
  const balanceToFinance = desired.price - tradeIn.acceptedValue;
  const interestRate = INTEREST_RATES[config.frequency];
  const totalInterest = balanceToFinance * interestRate;
  const totalWithInterest = balanceToFinance + totalInterest;
  const installmentAmount = totalWithInterest / config.installments;

  const startDate = new Date();
  const schedule: PaymentScheduleItem[] = [];

  for (let i = 0; i < config.installments; i++) {
    const paymentDate = getNextPaymentDate(startDate, i + 1, config.frequency);
    const remaining = totalWithInterest - installmentAmount * (i + 1);

    schedule.push({
      number: i + 1,
      date: paymentDate,
      amount: Math.round(installmentAmount),
      remainingBalance: Math.max(0, Math.round(remaining)),
    });
  }

  // Adjust last payment for rounding
  if (schedule.length > 0) {
    const sumBeforeLast = schedule.slice(0, -1).reduce((sum, p) => sum + p.amount, 0);
    schedule[schedule.length - 1].amount = Math.round(totalWithInterest) - sumBeforeLast;
    schedule[schedule.length - 1].remainingBalance = 0;
  }

  return {
    client,
    tradeIn,
    desired,
    balanceToFinance,
    interestRate,
    totalWithInterest: Math.round(totalWithInterest),
    totalInterest: Math.round(totalInterest),
    config,
    schedule,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
