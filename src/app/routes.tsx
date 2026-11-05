import { lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { firstStepPath } from '@/flows/steps';
import { Landing } from '@/pages/Landing';
import { useConfig } from './ConfigContext';

const FlowLayout = lazy(() => import('@/flows/FlowLayout'));
const Examples = lazy(() => import('@/pages/Examples'));
const Tweaks = lazy(() => import('@/pages/Tweaks'));
const Kit = lazy(() => import('@/pages/Kit'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/** Share links use #/review?c=...; send them to the review step of the saved mode. */
function ShareLink() {
  const { config } = useConfig();
  const { search } = useLocation();
  return <Navigate to={{ pathname: `/${config.mode}/review`, search }} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Landing />} />
        <Route path="fresh" element={<Navigate to={firstStepPath('fresh')} replace />} />
        <Route path="fresh/:stepId" element={<FlowLayout mode="fresh" />} />
        <Route path="restyle" element={<Navigate to={firstStepPath('restyle')} replace />} />
        <Route path="restyle/:stepId" element={<FlowLayout mode="restyle" />} />
        <Route path="review" element={<ShareLink />} />
        <Route path="tweaks" element={<Tweaks />} />
        <Route path="examples" element={<Examples />} />
        <Route path="kit" element={<Kit />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
