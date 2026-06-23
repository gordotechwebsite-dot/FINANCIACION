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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-primary">Plan de Financiacion</h2>
        <p className="text-gray-400 text-xs mt-0.5">Configura las condiciones del credito</p>
      </div>

      <div className="bg-primary rounded-lg px-4 py-3 text-center">
        <p className="text-white/60 text-[11px]">Saldo a financiar</p>
        <p className="text-white text-xl font-bold">{formatCurrency(balance)}</p>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 mb-1.5 block">Frecuencia de pago</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleFrequencyChange('mensual')}
            className={`py-3 px-3 rounded-lg border text-center transition-colors cursor-pointer ${
              data.frequency === 'mensual'
                ? 'border-accent bg-accent text-white'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            <span className="font-semibold text-sm block">Mensual</span>
            <span className={`text-[11px] block mt-0.5 ${data.frequency === 'mensual' ? 'text-white/70' : 'text-gray-400'}`}>6% interes &middot; Max 3 cuotas</span>
          </button>
          <button
            type="button"
            onClick={() => handleFrequencyChange('quincenal')}
            className={`py-3 px-3 rounded-lg border text-center transition-colors cursor-pointer ${
              data.frequency === 'quincenal'
                ? 'border-accent bg-accent text-white'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            <span className="font-semibold text-sm block">Quincenal</span>
            <span className={`text-[11px] block mt-0.5 ${data.frequency === 'quincenal' ? 'text-white/70' : 'text-gray-400'}`}>5% interes &middot; Max 6 cuotas</span>
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label className="text-xs font-medium text-gray-500">Numero de cuotas</label>
          <span className="text-lg font-bold text-accent">{data.installments}</span>
        </div>
        <input
          type="range"
          min={1}
          max={maxInstallments}
          value={data.installments}
          onChange={(e) => setData({ ...data, installments: Number(e.target.value) })}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
          <span>1</span>
          <span>{maxInstallments}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Interes ({(interestRate * 100).toFixed(0)}%)</span>
          <span className="font-semibold text-primary">{formatCurrency(totalInterest)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Total a pagar</span>
          <span className="font-semibold text-primary">{formatCurrency(totalWithInterest)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-baseline">
          <span className="text-xs text-gray-500">Valor por cuota</span>
          <span className="text-lg font-bold text-accent">{formatCurrency(Math.round(installmentAmount))}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50 cursor-pointer"
        >
          Atras
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-accent text-white rounded-lg font-semibold text-sm transition-colors hover:bg-accent/90 active:bg-accent/80 cursor-pointer"
        >
          Ver calendario
        </button>
      </div>
    </form>
  );
}
