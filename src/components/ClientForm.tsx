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
    if (!data.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!data.cedula.trim()) newErrors.cedula = 'La cedula es obligatoria';
    if (!data.phone.trim()) newErrors.phone = 'El numero de celular es obligatorio';
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
        <h2 className="text-2xl font-bold text-primary">Datos del Cliente</h2>
        <p className="text-gray-500 mt-1">Ingresa la informacion del cliente</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Nombre Completo
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="Ej: Juan Perez"
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
              errors.name
                ? 'border-highlight bg-red-50 focus:border-highlight'
                : 'border-gray-200 bg-white focus:border-accent focus:ring-2 focus:ring-accent/10'
            }`}
          />
          {errors.name && <p className="text-highlight text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Cedula de Ciudadania
          </label>
          <input
            type="text"
            value={data.cedula}
            onChange={(e) => setData({ ...data, cedula: e.target.value.replace(/[^0-9]/g, '') })}
            placeholder="Ej: 1234567890"
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
              errors.cedula
                ? 'border-highlight bg-red-50 focus:border-highlight'
                : 'border-gray-200 bg-white focus:border-accent focus:ring-2 focus:ring-accent/10'
            }`}
          />
          {errors.cedula && <p className="text-highlight text-xs mt-1">{errors.cedula}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Numero de Celular
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value.replace(/[^0-9]/g, '') })}
            placeholder="Ej: 3001234567"
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
              errors.phone
                ? 'border-highlight bg-red-50 focus:border-highlight'
                : 'border-gray-200 bg-white focus:border-accent focus:ring-2 focus:ring-accent/10'
            }`}
          />
          {errors.phone && <p className="text-highlight text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 cursor-pointer"
      >
        Continuar
      </button>
    </form>
  );
}
