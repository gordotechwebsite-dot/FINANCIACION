import { useState } from 'react';
import { Smartphone, DollarSign, ChevronLeft } from 'lucide-react';
import type { DesiredPhone, TradeInPhone } from '../types';
import { formatCurrency } from '../utils/calculations';

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
    if (!data.model.trim()) newErrors.model = 'El modelo es obligatorio';
    if (data.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (data.price <= tradeIn.acceptedValue) {
      newErrors.price = `El precio debe ser mayor al valor del trade-in (${formatCurrency(tradeIn.acceptedValue)})`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onNext(data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Equipo Deseado</h2>
        <p className="text-gray-500 mt-1">Que equipo quiere llevar el cliente?</p>
      </div>

      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-2">
        <p className="text-sm text-accent font-medium">
          Valor del equipo entregado: <span className="font-bold">{formatCurrency(tradeIn.acceptedValue)}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
            <Smartphone size={16} className="text-accent" />
            Modelo del Equipo Deseado
          </label>
          <input
            type="text"
            value={data.model}
            onChange={(e) => setData({ ...data, model: e.target.value })}
            placeholder="Ej: iPhone 15 Pro Max"
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
              errors.model
                ? 'border-highlight bg-red-50'
                : 'border-gray-200 bg-white focus:border-accent focus:ring-2 focus:ring-accent/10'
            }`}
          />
          {errors.model && <p className="text-highlight text-xs mt-1">{errors.model}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
            <DollarSign size={16} className="text-accent" />
            Precio del Equipo (COP)
          </label>
          <input
            type="number"
            value={data.price || ''}
            onChange={(e) => setData({ ...data, price: Number(e.target.value) })}
            placeholder="Ej: 3500000"
            min={0}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
              errors.price
                ? 'border-highlight bg-red-50'
                : 'border-gray-200 bg-white focus:border-accent focus:ring-2 focus:ring-accent/10'
            }`}
          />
          {errors.price && <p className="text-highlight text-xs mt-1">{errors.price}</p>}
        </div>
      </div>

      {balancePreview > 0 && (
        <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-5 text-white text-center">
          <p className="text-sm opacity-80">Saldo a financiar</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(balancePreview)}</p>
        </div>
      )}

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
          Continuar
        </button>
      </div>
    </form>
  );
}
