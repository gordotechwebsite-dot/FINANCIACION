import { useState } from 'react';
import type { ClientData, City } from '../types';

const CITIES: { value: City; label: string }[] = [
  { value: 'duitama', label: 'Duitama' },
  { value: 'tunja', label: 'Tunja' },
  { value: 'clinica', label: 'Clinica' },
];

interface ClientFormProps {
  initialData: ClientData;
  onNext: (data: ClientData) => void;
}

export default function ClientForm({ initialData, onNext }: ClientFormProps) {
  const [data, setData] = useState<ClientData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientData, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof ClientData, string>> = {};
    if (!data.name.trim()) newErrors.name = 'Obligatorio';
    if (!data.cedula.trim()) newErrors.cedula = 'Obligatorio';
    if (!data.phone.trim()) newErrors.phone = 'Obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onNext(data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
      <h2 className="text-base sm:text-xl font-bold text-primary mb-3 sm:mb-4">Datos del Cliente</h2>

      <div>
        <label className="text-[11px] sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1 block">Sede</label>
        <div className="grid grid-cols-3 gap-2">
          {CITIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setData({ ...data, city: c.value })}
              className={`py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                data.city === c.value
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[11px] sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1 block">Nombre completo</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="Juan Perez"
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border outline-none transition-colors ${
            errors.name ? 'border-highlight bg-red-50/50' : 'border-gray-300 focus:border-accent'
          }`}
        />
        {errors.name && <p className="text-highlight text-[11px] mt-0.5">{errors.name}</p>}
      </div>

      <div>
        <label className="text-[11px] sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1 block">Cedula</label>
        <input
          type="text"
          value={data.cedula}
          onChange={(e) => setData({ ...data, cedula: e.target.value.replace(/[^0-9]/g, '') })}
          placeholder="1234567890"
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border outline-none transition-colors ${
            errors.cedula ? 'border-highlight bg-red-50/50' : 'border-gray-300 focus:border-accent'
          }`}
        />
        {errors.cedula && <p className="text-highlight text-[11px] mt-0.5">{errors.cedula}</p>}
      </div>

      <div>
        <label className="text-[11px] sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1 block">Celular</label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value.replace(/[^0-9]/g, '') })}
          placeholder="3001234567"
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border outline-none transition-colors ${
            errors.phone ? 'border-highlight bg-red-50/50' : 'border-gray-300 focus:border-accent'
          }`}
        />
        {errors.phone && <p className="text-highlight text-[11px] mt-0.5">{errors.phone}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-2.5 sm:py-3 bg-accent text-white rounded-lg font-semibold text-sm sm:text-base transition-colors hover:bg-accent/90 active:bg-accent/80 cursor-pointer mt-2 sm:mt-4"
      >
        Continuar
      </button>
    </form>
  );
}
