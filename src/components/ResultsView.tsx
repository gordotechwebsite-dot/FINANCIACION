import type { FinancingResult } from '../types';
import { formatCurrency, formatDate, formatDateShort } from '../utils/calculations';
import { generatePDF } from '../utils/pdfGenerator';

interface ResultsViewProps {
  result: FinancingResult;
  onReset: () => void;
}

export default function ResultsView({ result, onReset }: ResultsViewProps) {
  const freqLabel = result.config.frequency === 'mensual' ? 'Mensual' : 'Quincenal';

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-lg font-bold text-primary">Resumen de Financiacion</h2>
        <p className="text-gray-400 text-xs mt-0.5">Revisa los detalles y exporta el PDF</p>
      </div>

      {/* Client */}
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Cliente</p>
        <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Nombre</span>
            <span className="font-medium text-primary">{result.client.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Cedula</span>
            <span className="font-medium text-primary">{result.client.cedula}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Celular</span>
            <span className="font-medium text-primary">{result.client.phone}</span>
          </div>
        </div>
      </div>

      {/* Phones */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Entrega</p>
          <div className="bg-gray-50 rounded-lg px-3 py-3">
            <p className="font-semibold text-sm text-primary">{result.tradeIn.model}</p>
            <p className="text-[11px] text-gray-400 mt-1">IMEI: {result.tradeIn.imei}</p>
            <p className="text-[11px] text-gray-400">{result.tradeIn.condition}</p>
            <p className="font-bold text-primary mt-2">{formatCurrency(result.tradeIn.acceptedValue)}</p>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Desea</p>
          <div className="bg-gray-50 rounded-lg px-3 py-3">
            <p className="font-semibold text-sm text-primary">{result.desired.model}</p>
            <p className="font-bold text-primary mt-8">{formatCurrency(result.desired.price)}</p>
          </div>
        </div>
      </div>

      {/* Finance summary */}
      <div className="bg-primary rounded-lg p-4 text-white">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-white/50">Diferencia</span>
            <p className="font-bold text-base">{formatCurrency(result.balanceToFinance)}</p>
          </div>
          <div>
            <span className="text-white/50">Interes ({(result.interestRate * 100).toFixed(0)}%)</span>
            <p className="font-bold text-base">{formatCurrency(result.totalInterest)}</p>
          </div>
          <div>
            <span className="text-white/50">Total a pagar</span>
            <p className="font-bold text-base">{formatCurrency(result.totalWithInterest)}</p>
          </div>
          <div>
            <span className="text-white/50">Cuotas</span>
            <p className="font-bold text-base">{result.config.installments} {freqLabel.toLowerCase()}es</p>
          </div>
        </div>
      </div>

      {/* Payment schedule */}
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">Calendario de pagos</p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-accent text-white">
                  <th className="px-3 py-2 text-left font-medium">#</th>
                  <th className="px-3 py-2 text-left font-medium">Fecha</th>
                  <th className="px-3 py-2 text-right font-medium">Cuota</th>
                  <th className="px-3 py-2 text-right font-medium">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((payment) => (
                  <tr
                    key={payment.number}
                    className={`border-t border-gray-100 ${
                      payment.number % 2 === 0 ? 'bg-gray-50/50' : ''
                    }`}
                  >
                    <td className="px-3 py-2 font-semibold text-accent">{payment.number}</td>
                    <td className="px-3 py-2">
                      <span className="text-gray-800">{formatDateShort(payment.date)}</span>
                      <span className="block text-[10px] text-gray-400 capitalize">{formatDate(payment.date).split(',')[0]}</span>
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-primary">{formatCurrency(payment.amount)}</td>
                    <td className="px-3 py-2 text-right">
                      <span className={`font-medium ${payment.remainingBalance === 0 ? 'text-success' : 'text-gray-500'}`}>
                        {payment.remainingBalance === 0 ? 'Pagado' : formatCurrency(payment.remainingBalance)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Legal */}
      <p className="text-[10px] text-gray-400 leading-relaxed">
        Ambas partes se comprometen a cumplir los terminos de este plan de financiacion.
        Las fechas son aproximadas a partir de hoy.
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { generatePDF(result); }}
          className="flex-1 py-3 bg-accent text-white rounded-lg font-semibold text-sm transition-colors hover:bg-accent/90 active:bg-accent/80 cursor-pointer"
        >
          Exportar PDF
        </button>
        <button
          type="button"
          onClick={onReset}
          className="px-5 py-3 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50 cursor-pointer"
        >
          Nueva
        </button>
      </div>
    </div>
  );
}
