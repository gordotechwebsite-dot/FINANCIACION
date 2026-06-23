import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Plan de Financiacion</h2>
        <p className="text-gray-500 mt-1">Configura las condiciones del credito</p>
      </div>

      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-5 text-white text-center mb-2">
        <p className="text-sm opacity-80">Saldo a financiar</p>
        <p className="text-3xl font-bold mt-1">{formatCurrency(balance)}</p>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Frecuencia de Pago
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleFrequencyChange('mensual')}
            className={`p-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
              data.frequency === 'mensual'
                ? 'border-accent bg-accent/5 text-accent'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <span className="font-bold text-lg block">Mensual</span>
            <span className="text-highlight font-semibold text-sm block mt-1">6% interes</span>
            <span className="text-xs text-gray-400 block mt-0.5">Hasta 3 cuotas</span>
          </button>
          <button
            type="button"
            onClick={() => handleFrequencyChange('quincenal')}
            className={`p-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
              data.frequency === 'quincenal'
                ? 'border-accent bg-accent/5 text-accent'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <span className="font-bold text-lg block">Quincenal</span>
            <span className="text-success font-semibold text-sm block mt-1">5% interes</span>
            <span className="text-xs text-gray-400 block mt-0.5">Hasta 6 cuotas</span>
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Numero de Cuotas: <span className="text-accent text-lg">{data.installments}</span>
        </label>
        <input
          type="range"
          min={1}
          max={maxInstallments}
          value={data.installments}
          onChange={(e) => setData({ ...data, installments: Number(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1 cuota</span>
          <span>{maxInstallments} cuotas</span>
        </div>
      </div>

      <div className="bg-surface-dark rounded-xl p-5 space-y-3">
        <h3 className="font-bold text-primary text-sm">Resumen del Plan</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Interes ({(interestRate * 100).toFixed(0)}%)</span>
            <p className="font-bold text-primary">{formatCurrency(totalInterest)}</p>
          </div>
          <div>
            <span className="text-gray-500">Total a pagar</span>
            <p className="font-bold text-primary">{formatCurrency(totalWithInterest)}</p>
          </div>
          <div className="col-span-2 pt-3 border-t border-gray-200">
            <span className="text-gray-500">Valor de cada cuota</span>
            <p className="font-bold text-accent text-2xl">{formatCurrency(Math.round(installmentAmount))}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-1 px-6 py-3.5 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50 cursor-pointer"
        >
          <ChevronLeft size={18} />
          Atras
        </button>
        <button
          type="submit"
          className="flex-1 py-3.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-xl cursor-pointer"
        >
          Ver Calendario de Pagos
        </button>
      </div>
    </form>
  );
}
