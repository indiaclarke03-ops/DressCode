import { ArrowLeft, ArrowRight } from 'lucide-react';
import { domAnimation, LazyMotion, m, MotionConfig } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Stepper } from '@/components/ui/Stepper';
import { PagePlaceholder } from '@/pages/PagePlaceholder';
import { FLOWS, firstStepPath, stepPath, type FlowMode } from './steps';

const STEP_TRANSITION = { duration: 0.2, ease: 'easeOut' } as const;

export default function FlowLayout({ mode }: { mode: FlowMode }) {
  const { stepId } = useParams();
  const { name, steps } = FLOWS[mode];
  const index = steps.findIndex((step) => step.id === stepId);
  const step = steps[index];

  if (!step) return <Navigate to={firstStepPath(mode)} replace />;

  const previous = steps[index - 1];
  const next = steps[index + 1];

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <div className="mx-auto max-w-page px-4 py-6 md:px-8 md:py-10">
          <Stepper
            currentId={step.id}
            steps={steps.map(({ id, label }) => ({ id, label, href: stepPath(mode, id) }))}
          />

          <m.div
            key={step.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={STEP_TRANSITION}
            className="mt-10 md:mt-16"
          >
            <p className="m-0 text-sm text-muted">{name}</p>
            <h1 className="mt-2 mb-0 max-w-3xl font-display text-title font-normal text-ink">
              {step.title}
            </h1>
            <p className="mt-3 mb-0 max-w-reading text-muted">{step.description}</p>

            <PagePlaceholder phase={step.phase} />

            <div className="mt-8 flex items-center justify-between">
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
              {next ? (
                <Button asChild>
                  <Link to={stepPath(mode, next.id)}>
                    Continue
                    <ArrowRight aria-hidden size={16} />
                  </Link>
                </Button>
              ) : null}
            </div>
          </m.div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
