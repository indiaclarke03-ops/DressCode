import { ArrowLeft, ArrowRight } from 'lucide-react';
import { domAnimation, LazyMotion, m, MotionConfig } from 'framer-motion';
import { lazy, Suspense, useCallback, useEffect, type ComponentType } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useConfig } from '@/app/ConfigContext';
import { Button } from '@/components/ui/Button';
import { Stepper } from '@/components/ui/Stepper';
import { ChangeSize } from './restyle/ChangeSize';
import { CurrentProject } from './restyle/CurrentProject';
import { KeepList } from './restyle/KeepList';
import { AvoidList } from './shared/AvoidList';
import { Colour } from './shared/Colour';
import { ProjectDetails } from './shared/ProjectDetails';
import { ProjectType } from './shared/ProjectType';
import { Review } from './shared/Review';
import { ThisOrThat } from './shared/ThisOrThat';
import { Typography } from './shared/Typography';
import { FLOWS, firstStepPath, stepPath, type FlowMode } from './steps';

const PreviewPanel = lazy(() => import('@/preview/PreviewPanel'));

const STEP_TRANSITION = { duration: 0.2, ease: 'easeOut' } as const;

const STEP_BODIES: Record<string, ComponentType<{ onDone: () => void }>> = {
  project: ProjectType,
  current: CurrentProject,
  keep: KeepList,
  size: ChangeSize,
  'this-or-that': ThisOrThat,
  colour: Colour,
  typography: Typography,
  details: ProjectDetails,
  avoid: AvoidList,
  review: Review,
};

export default function FlowLayout({ mode }: { mode: FlowMode }) {
  const { stepId } = useParams();
  const { dispatch } = useConfig();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: 'setMode', mode });
  }, [dispatch, mode]);

  const { name, steps } = FLOWS[mode];
  const index = steps.findIndex((step) => step.id === stepId);
  const step = steps[index];

  const previous = steps[index - 1];
  const next = steps[index + 1];
  const goNext = useCallback(() => {
    if (next) navigate(stepPath(mode, next.id));
  }, [mode, navigate, next]);

  if (!step) return <Navigate to={firstStepPath(mode)} replace />;

  const Body = STEP_BODIES[step.id] ?? ProjectType;
  const hasSidePreview = step.preview === 'side';

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <div
          className={`mx-auto max-w-flow px-4 py-6 md:px-8 md:py-10 ${hasSidePreview ? 'pb-24 xl:pb-10' : ''}`}
        >
          <Stepper
            currentId={step.id}
            steps={steps.map(({ id, label }) => ({ id, label, href: stepPath(mode, id) }))}
          />

          <div
            className={`mt-10 md:mt-12 ${hasSidePreview ? 'gap-10 xl:grid xl:grid-cols-[minmax(0,1fr)_var(--dc-preview-width)]' : ''}`}
          >
            <m.div
              key={step.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={STEP_TRANSITION}
              className="min-w-0"
            >
              <p className="m-0 text-sm text-muted">{name}</p>
              <h1 className="mt-2 mb-0 max-w-3xl font-display text-title font-normal text-ink">
                {step.title}
              </h1>
              <p className="mt-3 mb-0 max-w-reading text-muted">{step.description}</p>

              <div className="mt-8 @container">
                <Body onDone={goNext} />
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
                {previous ? (
                  <Button asChild variant="ghost" className="-ml-4">
                    <Link to={stepPath(mode, previous.id)}>
                      <ArrowLeft aria-hidden size={16} />
                      Back
                    </Link>
                  </Button>
                ) : (
                  <span />
                )}
                {next && !step.ownsNext ? (
                  <Button asChild>
                    <Link to={stepPath(mode, next.id)}>
                      Continue
                      <ArrowRight aria-hidden size={16} />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </m.div>

            {/* Outside the keyed block, so moving between steps never re-mounts it. */}
            {hasSidePreview ? (
              <Suspense fallback={null}>
                <PreviewPanel />
              </Suspense>
            ) : null}
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
