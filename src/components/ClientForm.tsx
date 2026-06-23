import { useState } from 'react';
import type { ClientData } from '../types';

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
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-base font-bold text-primary mb-3">Datos del Cliente</h2>

      <div>
        <label className="text-[11px] font-medium text-gray-500 mb-0.5 block">Nombre completo</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="Juan Perez"
          className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
            errors.name ? 'border-highlight bg-red-50/50' : 'border-gray-300 focus:border-accent'
          }`}
        />
        {errors.name && <p className="text-highlight text-[11px] mt-0.5">{errors.name}</p>}
      </div>

      <div>
        <label className="text-[11px] font-medium text-gray-500 mb-0.5 block">Cedula</label>
        <input
          type="text"
          value={data.cedula}
          onChange={(e) => setData({ ...data, cedula: e.target.value.replace(/[^0-9]/g, '') })}
          placeholder="1234567890"
          className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
            errors.cedula ? 'border-highlight bg-red-50/50' : 'border-gray-300 focus:border-accent'
          }`}
        />
        {errors.cedula && <p className="text-highlight text-[11px] mt-0.5">{errors.cedula}</p>}
      </div>

      <div>
        <label className="text-[11px] font-medium text-gray-500 mb-0.5 block">Celular</label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value.replace(/[^0-9]/g, '') })}
          placeholder="3001234567"
          className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
            errors.phone ? 'border-highlight bg-red-50/50' : 'border-gray-300 focus:border-accent'
          }`}
        />
        {errors.phone && <p className="text-highlight text-[11px] mt-0.5">{errors.phone}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-accent text-white rounded-lg font-semibold text-sm transition-colors hover:bg-accent/90 active:bg-accent/80 cursor-pointer mt-2"
      >
        Continuar
      </button>
    </form>
  );
}
