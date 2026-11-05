import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { firstStepPath } from '@/flows/steps';
import { Landing } from '@/pages/Landing';

const FlowLayout = lazy(() => import('@/flows/FlowLayout'));
const Examples = lazy(() => import('@/pages/Examples'));
const Tweaks = lazy(() => import('@/pages/Tweaks'));
const Kit = lazy(() => import('@/pages/Kit'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Landing />} />
        <Route path="fresh" element={<Navigate to={firstStepPath('fresh')} replace />} />
        <Route path="fresh/:stepId" element={<FlowLayout mode="fresh" />} />
        <Route path="restyle" element={<Navigate to={firstStepPath('restyle')} replace />} />
        <Route path="restyle/:stepId" element={<FlowLayout mode="restyle" />} />
        <Route path="tweaks" element={<Tweaks />} />
        <Route path="examples" element={<Examples />} />
        <Route path="kit" element={<Kit />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
