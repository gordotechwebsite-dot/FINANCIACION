import { useState } from 'react';
import type { FinancingConfig, PaymentFrequency } from '../types';
import { getMaxInstallments, getInterestRate, formatCurrency } from '../utils/calculations';

interface FinancingFormProps {
  balance: number;
  initialData: FinancingConfig;
  onNext: (data: FinancingConfig) => void;
  onBack: () => void;
}

export default function FinancingForm({ balance, initialData, onNext, onBack }: FinancingFormProps) {
  const [data, setData] = useState<FinancingConfig>(initialData);

  const maxInstallments = getMaxInstallments(data.frequency);
  const interestRate = getInterestRate(data.frequency);
  const totalInterest = balance * interestRate;
  const totalWithInterest = balance + totalInterest;
  const installmentAmount = totalWithInterest / data.installments;

  function handleFrequencyChange(freq: PaymentFrequency) {
    const newMax = getMaxInstallments(freq);
    setData({
      frequency: freq,
      installments: Math.min(data.installments, newMax),
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext(data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
      <h2 className="text-base sm:text-xl font-bold text-primary mb-2 sm:mb-4">Plan de Financiacion</h2>

      <div className="bg-primary rounded-lg px-3 py-2 sm:px-4 sm:py-4 text-center">
        <p className="text-white/60 text-[10px] sm:text-xs">Saldo a financiar</p>
        <p className="text-white text-lg sm:text-xl font-bold">{formatCurrency(balance)}</p>
      </div>

      <div>
        <label className="text-[11px] sm:text-sm font-medium text-gray-500 mb-1 block">Frecuencia de pago</label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => handleFrequencyChange('mensual')}
            className={`py-2 sm:py-3 px-2 sm:px-3 rounded-lg border text-center transition-colors cursor-pointer ${
              data.frequency === 'mensual'
                ? 'border-accent bg-accent text-white'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            <span className="font-semibold text-sm sm:text-base block">Mensual</span>
            <span className={`text-[10px] sm:text-xs block ${data.frequency === 'mensual' ? 'text-white/70' : 'text-gray-400'}`}>6% &middot; Max 3</span>
          </button>
          <button
            type="button"
            onClick={() => handleFrequencyChange('quincenal')}
            className={`py-2 sm:py-3 px-2 sm:px-3 rounded-lg border text-center transition-colors cursor-pointer ${
              data.frequency === 'quincenal'
                ? 'border-accent bg-accent text-white'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            <span className="font-semibold text-sm sm:text-base block">Quincenal</span>
            <span className={`text-[10px] sm:text-xs block ${data.frequency === 'quincenal' ? 'text-white/70' : 'text-gray-400'}`}>5% &middot; Max 6</span>
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-1">
          <label className="text-[11px] sm:text-sm font-medium text-gray-500">Cuotas</label>
          <span className="text-base sm:text-lg font-bold text-accent">{data.installments}</span>
        </div>
        <input
          type="range"
          min={1}
          max={maxInstallments}
          value={data.installments}
          onChange={(e) => setData({ ...data, installments: Number(e.target.value) })}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>1</span>
          <span>{maxInstallments}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-gray-500">Interes ({(interestRate * 100).toFixed(0)}%)</span>
          <span className="font-semibold text-primary">{formatCurrency(totalInterest)}</span>
        </div>
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-gray-500">Total</span>
          <span className="font-semibold text-primary">{formatCurrency(totalWithInterest)}</span>
        </div>
        <div className="border-t border-gray-200 pt-1.5 sm:pt-2 flex justify-between items-baseline">
          <span className="text-xs sm:text-sm text-gray-500">Cuota</span>
          <span className="text-base sm:text-lg font-bold text-accent">{formatCurrency(Math.round(installmentAmount))}</span>
        </div>
      </div>

      <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-3">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-600 rounded-lg text-sm sm:text-base font-medium transition-colors hover:bg-gray-50 cursor-pointer"
        >
          Atras
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 sm:py-3 bg-accent text-white rounded-lg font-semibold text-sm sm:text-base transition-colors hover:bg-accent/90 active:bg-accent/80 cursor-pointer"
        >
          Ver plan de pagos
        </button>
      </div>
    </form>
  );
}
