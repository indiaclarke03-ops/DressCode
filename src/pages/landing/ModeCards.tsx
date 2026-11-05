import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FreshIllustration, RestyleIllustration, TweakIllustration } from './illustrations';

interface ModeCardProps {
  to: string;
  title: string;
  description: string;
  output: string;
  illustration: ReactNode;
  className?: string;
}

function ModeCard({ to, title, description, output, illustration, className = '' }: ModeCardProps) {
  return (
    <Link
      to={to}
      className={`group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors duration-150 hover:border-line-strong ${className}`}
    >
      <div className="flex flex-col justify-end p-5 md:p-6">
        <h3 className="m-0 flex items-center gap-2 font-display text-heading font-normal text-ink">
          {title}
          <ArrowRight
            aria-hidden
            size={20}
            className="text-accent-ink transition-transform duration-150 group-hover:translate-x-1"
          />
        </h3>
        <p className="mt-2 mb-0 text-muted">{description}</p>
        <p className="mt-3 mb-0 font-mono text-label text-muted">{output}</p>
      </div>
      {illustration}
    </Link>
  );
}

/** One leading card and two companions, so the choice has a clear first read. */
export function ModeCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
      <ModeCard
        to="/fresh"
        title="Start fresh"
        description="You're about to build something new. Set the look before the first line of code."
        output="DESIGN.md, SKILL.md, CLAUDE.md, kickoff prompt"
        illustration={<FreshIllustration />}
        className="lg:col-span-7 lg:row-span-2"
      />
      <ModeCard
        to="/restyle"
        title="Restyle existing"
        description="Your project works but you dislike how it looks. Change the look, not what it does."
        output="DESIGN.md, RESTYLE.md"
        illustration={<RestyleIllustration />}
        className="lg:col-span-5"
      />
      <ModeCard
        to="/tweaks"
        title="Quick tweaks"
        description="You want one small change: a colour, a font, a table, a map type."
        output="A short prompt to paste"
        illustration={<TweakIllustration />}
        className="lg:col-span-5"
      />
    </div>
  );
}
