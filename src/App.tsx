import { useState, useRef, useEffect } from 'react';
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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [step]);

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
    <div className="h-full flex flex-col overflow-hidden">
      <header className="bg-primary shrink-0">
        <div className="max-w-lg mx-auto px-4 pt-2 pb-1.5 flex items-center justify-center gap-2.5">
          <img src={logoGordotech} alt="Gordotech" className="h-7 w-7 object-contain" />
          <h1 className="text-white text-sm font-bold tracking-wide">GORDOTECH</h1>
        </div>
        {step < 5 && (
          <div className="max-w-lg mx-auto px-4 pb-2">
            <StepIndicator currentStep={step} totalSteps={5} labels={STEP_LABELS} />
          </div>
        )}
      </header>

      <main ref={contentRef} className="flex-1 overflow-y-auto overscroll-none">
        <div className="max-w-lg mx-auto px-3 py-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 p-4">
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

          <footer className="text-center mt-3 pb-3">
            <a href="https://gordotech.co" target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-400 hover:text-accent transition-colors">
              gordotech.co
            </a>
          </footer>
        </div>
      </main>
    </div>
  );
}
