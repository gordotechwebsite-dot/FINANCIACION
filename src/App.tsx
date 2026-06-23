import { useState } from 'react';
import StepIndicator from './components/StepIndicator';
import ClientForm from './components/ClientForm';
import TradeInForm from './components/TradeInForm';
import DesiredPhoneForm from './components/DesiredPhoneForm';
import FinancingForm from './components/FinancingForm';
import ResultsView from './components/ResultsView';
import { calculateFinancing } from './utils/calculations';
import type {
  ClientData,
  TradeInPhone,
  DesiredPhone,
  FinancingConfig,
  FinancingResult,
} from './types';
import logoGordotech from '/logo-gordotech-white.png?url';

const STEP_LABELS = ['Cliente', 'Equipo Actual', 'Equipo Nuevo', 'Financiacion', 'Resultado'];

const INITIAL_CLIENT: ClientData = { name: '', cedula: '', phone: '' };
const INITIAL_TRADE_IN: TradeInPhone = { imei: '', model: '', condition: 'Bueno', acceptedValue: 0 };
const INITIAL_DESIRED: DesiredPhone = { model: '', price: 0 };
const INITIAL_FINANCING: FinancingConfig = { frequency: 'mensual', installments: 3 };

export default function App() {
  const [step, setStep] = useState(1);
  const [client, setClient] = useState<ClientData>(INITIAL_CLIENT);
  const [tradeIn, setTradeIn] = useState<TradeInPhone>(INITIAL_TRADE_IN);
  const [desired, setDesired] = useState<DesiredPhone>(INITIAL_DESIRED);
  const [financing, setFinancing] = useState<FinancingConfig>(INITIAL_FINANCING);
  const [result, setResult] = useState<FinancingResult | null>(null);

  function handleClientNext(data: ClientData) {
    setClient(data);
    setStep(2);
  }

  function handleTradeInNext(data: TradeInPhone) {
    setTradeIn(data);
    setStep(3);
  }

  function handleDesiredNext(data: DesiredPhone) {
    setDesired(data);
    setStep(4);
  }

  function handleFinancingNext(config: FinancingConfig) {
    setFinancing(config);
    const res = calculateFinancing(client, tradeIn, desired, config);
    setResult(res);
    setStep(5);
  }

  function handleReset() {
    setStep(1);
    setClient(INITIAL_CLIENT);
    setTradeIn(INITIAL_TRADE_IN);
    setDesired(INITIAL_DESIRED);
    setFinancing(INITIAL_FINANCING);
    setResult(null);
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-light shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center gap-4">
          <img
            src={logoGordotech}
            alt="Gordotech"
            className="h-12 w-12 object-contain"
          />
          <div className="text-center">
            <h1 className="text-white text-xl font-bold tracking-wide">GORDOTECH</h1>
            <p className="text-white/60 text-xs">Sistema de Financiacion</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {step < 5 && (
          <StepIndicator currentStep={step} totalSteps={5} labels={STEP_LABELS} />
        )}

        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8">
          {step === 1 && (
            <ClientForm initialData={client} onNext={handleClientNext} />
          )}
          {step === 2 && (
            <TradeInForm
              initialData={tradeIn}
              onNext={handleTradeInNext}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <DesiredPhoneForm
              initialData={desired}
              tradeIn={tradeIn}
              onNext={handleDesiredNext}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <FinancingForm
              balance={desired.price - tradeIn.acceptedValue}
              initialData={financing}
              onNext={handleFinancingNext}
              onBack={() => setStep(3)}
            />
          )}
          {step === 5 && result && (
            <ResultsView result={result} onReset={handleReset} />
          )}
        </div>

        <footer className="text-center mt-8 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Gordotech - Todos los derechos reservados</p>
        </footer>
      </main>
    </div>
  );
}
