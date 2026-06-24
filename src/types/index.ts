export type PhoneCondition = 'Excelente' | 'Bueno' | 'Regular';

export type PaymentFrequency = 'mensual' | 'quincenal';

export type City = 'duitama' | 'tunja' | 'clinica';

export interface ClientData {
  name: string;
  cedula: string;
  phone: string;
  city: City;
}

export interface TradeInPhone {
  imei: string;
  model: string;
  condition: PhoneCondition;
  acceptedValue: number;
}

export interface DesiredPhone {
  model: string;
  price: number;
}

export interface FinancingConfig {
  frequency: PaymentFrequency;
  installments: number;
}

export interface PaymentScheduleItem {
  number: number;
  date: Date;
  amount: number;
  remainingBalance: number;
}

export interface FinancingResult {
  client: ClientData;
  tradeIn: TradeInPhone;
  desired: DesiredPhone;
  balanceToFinance: number;
  interestRate: number;
  totalWithInterest: number;
  totalInterest: number;
  config: FinancingConfig;
  schedule: PaymentScheduleItem[];
}
