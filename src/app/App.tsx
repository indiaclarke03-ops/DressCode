import { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from './ConfigContext';
import { AppRoutes } from './routes';

export function App() {
  return (
    <HashRouter>
      <ConfigProvider>
        <Suspense fallback={null}>
          <AppRoutes />
        </Suspense>
      </ConfigProvider>
    </HashRouter>
  );
}
