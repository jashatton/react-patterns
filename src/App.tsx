import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { Home } from './pages/Home';
import { UseEffectPage } from './patterns/useEffect/UseEffectPage';
import { MutationPage } from './patterns/mutation/MutationPage';
import { DerivedStatePage } from './patterns/derivedState/DerivedStatePage';
import { KeysPage } from './patterns/keys/KeysPage';
import { UseCallbackPage } from './patterns/useCallback/UseCallbackPage';
import { UseMemoPage } from './patterns/useMemo/UseMemoPage';
import { ArrowFunctionsPage } from './patterns/arrowFunctions/ArrowFunctionsPage';
import { UseRefPage } from './patterns/useRef/UseRefPage';
import { ContextPage } from './patterns/context/ContextPage';
import { LiftingStatePage } from './patterns/liftingState/LiftingStatePage';
import { StrictModePage } from './patterns/strictMode/StrictModePage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Pattern routes will be added as we implement them */}
            <Route path="/use-effect" element={<UseEffectPage />} />
            <Route path="/mutation" element={<MutationPage />} />
            <Route path="/derived-state" element={<DerivedStatePage />} />
            <Route path="/keys" element={<KeysPage />} />
            <Route path="/use-callback" element={<UseCallbackPage />} />
            <Route path="/use-memo" element={<UseMemoPage />} />
            <Route path="/arrow-functions" element={<ArrowFunctionsPage />} />
            <Route path="/use-ref" element={<UseRefPage />} />
            <Route path="/context" element={<ContextPage />} />
            <Route path="/lifting-state" element={<LiftingStatePage />} />
            <Route path="/strict-mode" element={<StrictModePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
