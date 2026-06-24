import { useState } from 'react';
import type { FinancingResult } from '../types';
import { formatCurrency, formatDateShort } from '../utils/calculations';
import { generatePDF } from '../utils/pdfGenerator';
import { sendToGoogleSheets } from '../utils/sheetsExport';

interface ResultsViewProps {
  result: FinancingResult;
  onBack: () => void;
  onReset: () => void;
}

export default function ResultsView({ result, onBack, onReset }: ResultsViewProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);
  const freqLabel = result.config.frequency === 'mensual' ? 'mensual' : 'quincenal';

  return (
    <div className="space-y-4 sm:space-y-5">
      <h2 className="text-base sm:text-xl font-bold text-primary">
        {confirmed ? 'Plan de Financiacion' : 'Confirmar Datos'}
      </h2>

      {!confirmed && (
        <p className="text-xs text-gray-400">Revisa que todo este correcto antes de confirmar</p>
      )}

      {/* Client */}
      <div className="text-xs sm:text-sm space-y-0.5 text-gray-600">
        <p><span className="text-gray-400">Cliente:</span> {result.client.name} &middot; CC {result.client.cedula} &middot; {result.client.phone}</p>
        <p><span className="text-gray-400">Sede:</span> {result.client.city.charAt(0).toUpperCase() + result.client.city.slice(1)}</p>
      </div>

      {/* Phones comparison */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="bg-gray-50 rounded-lg px-3 py-2.5 sm:px-4 sm:py-4">
          <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">Entrega</p>
          <p className="font-semibold text-sm sm:text-base text-primary mt-0.5">{result.tradeIn.model}</p>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{result.tradeIn.condition} &middot; {result.tradeIn.imei}</p>
          <p className="font-bold text-sm sm:text-base text-primary mt-1">{formatCurrency(result.tradeIn.acceptedValue)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2.5 sm:px-4 sm:py-4">
          <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">Adquiere</p>
          <p className="font-semibold text-sm sm:text-base text-primary mt-0.5">{result.desired.model}</p>
          <p className="font-bold text-sm sm:text-base text-primary mt-4">{formatCurrency(result.desired.price)}</p>
        </div>
      </div>

      {/* Key numbers */}
      <div className="bg-primary rounded-lg p-3 sm:p-4">
        <div className="flex justify-between items-center text-white mb-2">
          <span className="text-white/50 text-xs">Financiar</span>
          <span className="font-bold text-lg">{formatCurrency(result.balanceToFinance)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/10 rounded px-2 py-1.5">
            <p className="text-white/50 text-[9px]">Interes {(result.interestRate * 100).toFixed(0)}%</p>
            <p className="text-white font-bold text-xs">{formatCurrency(result.totalInterest)}</p>
          </div>
          <div className="bg-white/10 rounded px-2 py-1.5">
            <p className="text-white/50 text-[9px]">Total</p>
            <p className="text-white font-bold text-xs">{formatCurrency(result.totalWithInterest)}</p>
          </div>
          <div className="bg-white/10 rounded px-2 py-1.5">
            <p className="text-white/50 text-[9px]">Cuotas</p>
            <p className="text-white font-bold text-xs">{result.config.installments} {freqLabel}es</p>
          </div>
        </div>
      </div>

      {/* Payment schedule */}
      <div>
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Plan de pagos</p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-[11px] sm:text-sm">
            <thead>
              <tr className="bg-accent text-white">
                <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-left font-medium w-8">#</th>
                <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-left font-medium">Fecha</th>
                <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-right font-medium">Cuota</th>
                <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-right font-medium">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((payment) => (
                <tr
                  key={payment.number}
                  className={payment.number % 2 === 0 ? 'bg-gray-50/60' : ''}
                >
                  <td className="px-2 py-1.5 font-semibold text-accent">{payment.number}</td>
                  <td className="px-2 py-1.5 text-gray-700">{formatDateShort(payment.date)}</td>
                  <td className="px-2 py-1.5 text-right font-semibold text-primary">{formatCurrency(payment.amount)}</td>
                  <td className="px-2 py-1.5 text-right">
                    <span className={payment.remainingBalance === 0 ? 'font-semibold text-success' : 'text-gray-500'}>
                      {payment.remainingBalance === 0 ? 'Pagado' : formatCurrency(payment.remainingBalance)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      {!confirmed ? (
        <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-600 rounded-lg text-sm sm:text-base font-medium transition-colors hover:bg-gray-50 cursor-pointer"
          >
            Atras
          </button>
          <button
            type="button"
            onClick={async () => {
              setSending(true);
              await sendToGoogleSheets(result);
              setSending(false);
              setConfirmed(true);
            }}
            disabled={sending}
            className="flex-1 py-2.5 sm:py-3 bg-accent text-white rounded-lg font-semibold text-sm sm:text-base transition-colors hover:bg-accent/90 active:bg-accent/80 cursor-pointer"
          >
            {sending ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      ) : (
        <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-3">
          <button
            type="button"
            onClick={() => { generatePDF(result); }}
            className="flex-1 py-2.5 sm:py-3 bg-accent text-white rounded-lg font-semibold text-sm sm:text-base transition-colors hover:bg-accent/90 active:bg-accent/80 cursor-pointer"
          >
            Exportar PDF
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-600 rounded-lg text-sm sm:text-base font-medium transition-colors hover:bg-gray-50 cursor-pointer"
          >
            Nueva
          </button>
        </div>
      )}
    </div>
  );
}
