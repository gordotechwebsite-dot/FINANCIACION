import { FileDown, RotateCcw, CalendarDays, User, Smartphone, ArrowRightLeft, Receipt } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-primary">Plan de Financiacion</h2>
        <p className="text-gray-500 mt-1">Resumen completo y calendario de pagos</p>
      </div>

      {/* Client info card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <User size={18} className="text-accent" />
          <h3 className="font-bold text-primary">Cliente</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <div>
            <span className="text-gray-400">Nombre</span>
            <p className="font-semibold text-gray-800">{result.client.name}</p>
          </div>
          <div>
            <span className="text-gray-400">Cedula</span>
            <p className="font-semibold text-gray-800">{result.client.cedula}</p>
          </div>
          <div>
            <span className="text-gray-400">Celular</span>
            <p className="font-semibold text-gray-800">{result.client.phone}</p>
          </div>
        </div>
      </div>

      {/* Phones comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone size={18} className="text-highlight" />
            <h3 className="font-bold text-primary text-sm">Equipo Entregado</h3>
          </div>
          <p className="font-bold text-lg text-gray-800">{result.tradeIn.model}</p>
          <p className="text-xs text-gray-400 mt-1">IMEI: {result.tradeIn.imei}</p>
          <p className="text-xs text-gray-400">Estado: {result.tradeIn.condition}</p>
          <p className="text-highlight font-bold text-xl mt-2">{formatCurrency(result.tradeIn.acceptedValue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone size={18} className="text-success" />
            <h3 className="font-bold text-primary text-sm">Equipo Deseado</h3>
          </div>
          <p className="font-bold text-lg text-gray-800">{result.desired.model}</p>
          <p className="text-success font-bold text-xl mt-6">{formatCurrency(result.desired.price)}</p>
        </div>
      </div>

      {/* Finance summary */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <ArrowRightLeft size={18} />
          <h3 className="font-bold">Resumen de Financiacion</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="opacity-70">Diferencia</span>
            <p className="font-bold text-xl">{formatCurrency(result.balanceToFinance)}</p>
          </div>
          <div>
            <span className="opacity-70">Interes ({(result.interestRate * 100).toFixed(0)}%)</span>
            <p className="font-bold text-xl">{formatCurrency(result.totalInterest)}</p>
          </div>
          <div>
            <span className="opacity-70">Total a Pagar</span>
            <p className="font-bold text-xl">{formatCurrency(result.totalWithInterest)}</p>
          </div>
          <div>
            <span className="opacity-70">Cuotas</span>
            <p className="font-bold text-xl">{result.config.installments} {freqLabel.toLowerCase()}es</p>
          </div>
        </div>
      </div>

      {/* Payment schedule */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 p-5 pb-3">
          <CalendarDays size={18} className="text-accent" />
          <h3 className="font-bold text-primary">Calendario de Pagos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-accent text-white">
                <th className="px-5 py-3 text-left font-semibold">No.</th>
                <th className="px-5 py-3 text-left font-semibold">Fecha de Pago</th>
                <th className="px-5 py-3 text-right font-semibold">Valor Cuota</th>
                <th className="px-5 py-3 text-right font-semibold">Saldo Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((payment) => (
                <tr
                  key={payment.number}
                  className={`border-b border-gray-50 hover:bg-accent/5 transition-colors ${
                    payment.number % 2 === 0 ? 'bg-gray-50/50' : ''
                  }`}
                >
                  <td className="px-5 py-3 font-bold text-accent">{payment.number}</td>
                  <td className="px-5 py-3">
                    <span className="font-medium text-gray-800">{formatDateShort(payment.date)}</span>
                    <span className="block text-xs text-gray-400 capitalize">{formatDate(payment.date).split(',')[0]}</span>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-primary">{formatCurrency(payment.amount)}</td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`font-semibold ${
                        payment.remainingBalance === 0 ? 'text-success' : 'text-gray-600'
                      }`}
                    >
                      {payment.remainingBalance === 0 ? 'Pagado' : formatCurrency(payment.remainingBalance)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legal note */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-2">
          <Receipt size={18} className="text-gray-400" />
          <h3 className="font-bold text-primary text-sm">Nota</h3>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Este plan de financiacion es generado por Gordotech. Las fechas de pago son aproximadas
          y comienzan a contar desde la fecha actual. Ambas partes se comprometen a cumplir con los
          terminos establecidos en este documento.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => generatePDF(result)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-xl cursor-pointer"
        >
          <FileDown size={20} />
          Exportar PDF
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50 cursor-pointer"
        >
          <RotateCcw size={18} />
          Nueva Financiacion
        </button>
      </div>
    </div>
  );
}
