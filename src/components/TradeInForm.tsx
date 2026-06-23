import { useState } from 'react';
import { Smartphone, Hash, Star, DollarSign, ChevronLeft } from 'lucide-react';
import type { TradeInPhone, PhoneCondition } from '../types';

interface TradeInFormProps {
  initialData: TradeInPhone;
  onNext: (data: TradeInPhone) => void;
  onBack: () => void;
}

const CONDITIONS: { value: PhoneCondition; label: string; description: string }[] = [
  { value: 'Excelente', label: 'Excelente', description: 'Como nuevo, sin marcas' },
  { value: 'Bueno', label: 'Bueno', description: 'Pocas marcas de uso' },
  { value: 'Regular', label: 'Regular', description: 'Marcas visibles de uso' },
];

export default function TradeInForm({ initialData, onNext, onBack }: TradeInFormProps) {
  const [data, setData] = useState<TradeInPhone>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof TradeInPhone, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof TradeInPhone, string>> = {};
    if (!data.imei.trim()) newErrors.imei = 'El IMEI es obligatorio';
    if (!data.model.trim()) newErrors.model = 'El modelo es obligatorio';
    if (data.acceptedValue <= 0) newErrors.acceptedValue = 'El valor debe ser mayor a 0';
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
        <h2 className="text-2xl font-bold text-primary">Equipo del Cliente</h2>
        <p className="text-gray-500 mt-1">Informacion del equipo que entrega el cliente</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
            <Hash size={16} className="text-accent" />
            IMEI del Equipo
          </label>
          <input
            type="text"
            value={data.imei}
            onChange={(e) => setData({ ...data, imei: e.target.value.replace(/[^0-9]/g, '') })}
            placeholder="Ej: 350000000000003"
            maxLength={15}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
              errors.imei
                ? 'border-highlight bg-red-50'
                : 'border-gray-200 bg-white focus:border-accent focus:ring-2 focus:ring-accent/10'
            }`}
          />
          {errors.imei && <p className="text-highlight text-xs mt-1">{errors.imei}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
            <Smartphone size={16} className="text-accent" />
            Modelo del Equipo
          </label>
          <input
            type="text"
            value={data.model}
            onChange={(e) => setData({ ...data, model: e.target.value })}
            placeholder="Ej: Samsung Galaxy S23"
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
              errors.model
                ? 'border-highlight bg-red-50'
                : 'border-gray-200 bg-white focus:border-accent focus:ring-2 focus:ring-accent/10'
            }`}
          />
          {errors.model && <p className="text-highlight text-xs mt-1">{errors.model}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Star size={16} className="text-accent" />
            Estado del Equipo
          </label>
          <div className="grid grid-cols-3 gap-3">
            {CONDITIONS.map((cond) => (
              <button
                key={cond.value}
                type="button"
                onClick={() => setData({ ...data, condition: cond.value })}
                className={`p-3 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                  data.condition === cond.value
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span className="font-semibold text-sm block">{cond.label}</span>
                <span className="text-xs text-gray-400 mt-0.5 block">{cond.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
            <DollarSign size={16} className="text-accent" />
            Valor Aceptado del Equipo (COP)
          </label>
          <input
            type="number"
            value={data.acceptedValue || ''}
            onChange={(e) => setData({ ...data, acceptedValue: Number(e.target.value) })}
            placeholder="Ej: 500000"
            min={0}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
              errors.acceptedValue
                ? 'border-highlight bg-red-50'
                : 'border-gray-200 bg-white focus:border-accent focus:ring-2 focus:ring-accent/10'
            }`}
          />
          {errors.acceptedValue && <p className="text-highlight text-xs mt-1">{errors.acceptedValue}</p>}
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
          Continuar
        </button>
      </div>
    </form>
  );
}
