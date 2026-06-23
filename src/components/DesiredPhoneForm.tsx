import { useState } from 'react';
import type { DesiredPhone, TradeInPhone } from '../types';
import { formatCurrency, formatNumberWithDots, parseNumberFromDots } from '../utils/calculations';

interface DesiredPhoneFormProps {
  initialData: DesiredPhone;
  tradeIn: TradeInPhone;
  onNext: (data: DesiredPhone) => void;
  onBack: () => void;
}

export default function DesiredPhoneForm({ initialData, tradeIn, onNext, onBack }: DesiredPhoneFormProps) {
  const [data, setData] = useState<DesiredPhone>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof DesiredPhone, string>>>({});

  const balancePreview = data.price > 0 ? data.price - tradeIn.acceptedValue : 0;

  function validate(): boolean {
    const newErrors: Partial<Record<keyof DesiredPhone, string>> = {};
    if (!data.model.trim()) newErrors.model = 'Obligatorio';
    if (data.price <= 0) newErrors.price = 'Debe ser mayor a 0';
    if (data.price <= tradeIn.acceptedValue) {
      newErrors.price = `Debe ser mayor a ${formatCurrency(tradeIn.acceptedValue)}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onNext(data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
      <h2 className="text-base sm:text-xl font-bold text-primary mb-3 sm:mb-4">Equipo Deseado</h2>

      <div className="bg-gray-50 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-600">
        Trade-in: <span className="font-semibold text-primary">{formatCurrency(tradeIn.acceptedValue)}</span>
      </div>

      <div>
        <label className="text-[11px] sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1 block">Modelo</label>
        <input
          type="text"
          value={data.model}
          onChange={(e) => setData({ ...data, model: e.target.value })}
          placeholder="iPhone 15 Pro Max"
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border outline-none transition-colors ${
            errors.model ? 'border-highlight bg-red-50/50' : 'border-gray-300 focus:border-accent'
          }`}
        />
        {errors.model && <p className="text-highlight text-[11px] mt-0.5">{errors.model}</p>}
      </div>

      <div>
        <label className="text-[11px] sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1 block">Precio (COP)</label>
        <input
          type="text"
          inputMode="numeric"
          value={formatNumberWithDots(data.price)}
          onChange={(e) => setData({ ...data, price: parseNumberFromDots(e.target.value) })}
          placeholder="3.500.000"
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border outline-none transition-colors ${
            errors.price ? 'border-highlight bg-red-50/50' : 'border-gray-300 focus:border-accent'
          }`}
        />
        {errors.price && <p className="text-highlight text-[11px] mt-0.5">{errors.price}</p>}
      </div>

      {balancePreview > 0 && (
        <div className="bg-primary rounded-lg px-3 py-2.5 sm:px-4 sm:py-4 text-center">
          <p className="text-white/60 text-[10px] sm:text-xs">Saldo a financiar</p>
          <p className="text-white text-lg sm:text-xl font-bold">{formatCurrency(balancePreview)}</p>
        </div>
      )}

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
          Continuar
        </button>
      </div>
    </form>
  );
}
