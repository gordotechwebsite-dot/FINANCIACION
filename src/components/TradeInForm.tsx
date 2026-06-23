import { useState } from 'react';
import type { TradeInPhone, PhoneCondition } from '../types';

interface TradeInFormProps {
  initialData: TradeInPhone;
  onNext: (data: TradeInPhone) => void;
  onBack: () => void;
}

const CONDITIONS: { value: PhoneCondition; label: string }[] = [
  { value: 'Excelente', label: 'Excelente' },
  { value: 'Bueno', label: 'Bueno' },
  { value: 'Regular', label: 'Regular' },
];

export default function TradeInForm({ initialData, onNext, onBack }: TradeInFormProps) {
  const [data, setData] = useState<TradeInPhone>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof TradeInPhone, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof TradeInPhone, string>> = {};
    if (!data.imei.trim()) newErrors.imei = 'Obligatorio';
    if (!data.model.trim()) newErrors.model = 'Obligatorio';
    if (data.acceptedValue <= 0) newErrors.acceptedValue = 'Debe ser mayor a 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onNext(data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-base font-bold text-primary mb-3">Equipo del Cliente</h2>

      <div>
        <label className="text-[11px] font-medium text-gray-500 mb-0.5 block">IMEI</label>
        <input
          type="text"
          value={data.imei}
          onChange={(e) => setData({ ...data, imei: e.target.value.replace(/[^0-9]/g, '') })}
          placeholder="350000000000003"
          maxLength={15}
          className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
            errors.imei ? 'border-highlight bg-red-50/50' : 'border-gray-300 focus:border-accent'
          }`}
        />
        {errors.imei && <p className="text-highlight text-[11px] mt-0.5">{errors.imei}</p>}
      </div>

      <div>
        <label className="text-[11px] font-medium text-gray-500 mb-0.5 block">Modelo</label>
        <input
          type="text"
          value={data.model}
          onChange={(e) => setData({ ...data, model: e.target.value })}
          placeholder="Samsung Galaxy S23"
          className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
            errors.model ? 'border-highlight bg-red-50/50' : 'border-gray-300 focus:border-accent'
          }`}
        />
        {errors.model && <p className="text-highlight text-[11px] mt-0.5">{errors.model}</p>}
      </div>

      <div>
        <label className="text-[11px] font-medium text-gray-500 mb-1 block">Estado</label>
        <div className="grid grid-cols-3 gap-2">
          {CONDITIONS.map((cond) => (
            <button
              key={cond.value}
              type="button"
              onClick={() => setData({ ...data, condition: cond.value })}
              className={`py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                data.condition === cond.value
                  ? 'border-accent bg-accent text-white'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[11px] font-medium text-gray-500 mb-0.5 block">Valor aceptado (COP)</label>
        <input
          type="number"
          value={data.acceptedValue || ''}
          onChange={(e) => setData({ ...data, acceptedValue: Number(e.target.value) })}
          placeholder="500000"
          min={0}
          className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
            errors.acceptedValue ? 'border-highlight bg-red-50/50' : 'border-gray-300 focus:border-accent'
          }`}
        />
        {errors.acceptedValue && <p className="text-highlight text-[11px] mt-0.5">{errors.acceptedValue}</p>}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50 cursor-pointer"
        >
          Atras
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 bg-accent text-white rounded-lg font-semibold text-sm transition-colors hover:bg-accent/90 active:bg-accent/80 cursor-pointer"
        >
          Continuar
        </button>
      </div>
    </form>
  );
}
