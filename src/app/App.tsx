import { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { AppRoutes } from './routes';

export function App() {
  return (
    <HashRouter>
      <Suspense fallback={null}>
        <AppRoutes />
      </Suspense>
    </HashRouter>
  );
}
