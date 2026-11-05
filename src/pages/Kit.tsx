import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { ChoiceCard, ChoiceGroup } from '@/components/ui/ChoiceCard';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Stepper } from '@/components/ui/Stepper';
import { Tabs } from '@/components/ui/Tabs';
import { FLOWS, stepPath } from '@/flows/steps';

const SAMPLE_BRIEF = `## Colour tokens
| Token      | Value   | Use                       |
|------------|---------|---------------------------|
| background | #FAFAF7 | Page background           |
| accent     | #1F5C45 | Primary buttons, key data |`;

const SAMPLE_TOKENS = `:root {
  --bb-color-background: #fafaf7;
  --bb-color-accent: #1f5c45;
}`;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-8">
      <h2 className="mt-0 mb-5 font-display text-heading font-normal text-ink">{title}</h2>
      {children}
    </section>
  );
}

/** Review page for the UI kit. Unlinked; remove in Phase 8. */
export default function Kit() {
  const [density, setDensity] = useState('airy');

  return (
    <div className="mx-auto max-w-page px-4 py-10 md:px-8 md:py-16">
      <h1 className="mt-0 mb-8 font-display text-title font-normal text-ink">UI kit</h1>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button>Download all</Button>
          <Button variant="secondary">Copy share link</Button>
          <Button variant="ghost">Back</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Choice cards">
        <ChoiceGroup
          label="Density"
          value={density}
          onValueChange={setDensity}
          className="grid gap-4 md:grid-cols-2"
        >
          <ChoiceCard value="airy" title="Airy" description="Room to breathe between things." />
          <ChoiceCard value="compact" title="Compact" description="More on screen at once." />
        </ChoiceGroup>
      </Section>

      <Section title="Stepper">
        <Stepper
          currentId="typography"
          steps={FLOWS.fresh.steps.map(({ id, label }) => ({
            id,
            label,
            href: stepPath('fresh', id),
          }))}
        />
      </Section>

      <Section title="Tabs and code">
        <Tabs
          label="Export format"
          items={[
            {
              value: 'design',
              label: 'DESIGN.md',
              content: <CodeBlock filename="DESIGN.md" code={SAMPLE_BRIEF} />,
            },
            {
              value: 'tokens',
              label: 'tokens.css',
              content: <CodeBlock filename="tokens.css" code={SAMPLE_TOKENS} />,
            },
          ]}
        />
      </Section>
    </div>
  );
}
