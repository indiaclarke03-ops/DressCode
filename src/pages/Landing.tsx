import { ArrowDown, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { BeforeAfter } from './landing/BeforeAfter';
import { ModeCards } from './landing/ModeCards';

export function Landing() {
  const modesHeading = useRef<HTMLHeadingElement>(null);

  const goToModes = () => {
    modesHeading.current?.scrollIntoView();
    modesHeading.current?.focus({ preventScroll: true });
  };

  return (
    <div className="mx-auto max-w-page px-4 md:px-8">
      <section className="grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="lg:col-span-6 lg:self-center">
          <h1 className="m-0 font-display text-display font-normal text-balance text-ink">
            Give your AI agent a dress code.
          </h1>
          <p className="mt-6 mb-0 max-w-reading text-lg/7 text-muted">
            Pick the look you want, and Dress Code turns your choices into a precise brief for
            Claude Code or any AI coding agent: real hex codes, fonts, spacing and a list of things
            to avoid.
          </p>
          <Button onClick={goToModes} className="mt-8">
            Choose a starting point
            <ArrowDown aria-hidden size={16} />
          </Button>
        </div>
        <div className="lg:col-span-6">
          <BeforeAfter />
        </div>
      </section>

      <section aria-labelledby="modes-heading" className="border-t border-line py-12 md:py-16">
        <h2
          id="modes-heading"
          ref={modesHeading}
          tabIndex={-1}
          className="mt-0 mb-8 scroll-mt-6 font-display text-title font-normal text-ink outline-none"
        >
          Where are you starting from?
        </h2>
        <ModeCards />
        <p className="mt-8 mb-0 text-muted">
          Not sure yet?{' '}
          <Link
            to="/examples"
            className="inline-flex items-center gap-1 rounded-button font-medium text-accent-ink underline underline-offset-4"
          >
            See example briefs
            <ArrowRight aria-hidden size={15} />
          </Link>
        </p>
      </section>
    </div>
  );
}
