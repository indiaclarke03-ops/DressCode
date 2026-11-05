import type { ComponentType } from 'react';
import type { SceneFamily } from '@/tokens/defaults';
import { DemoCard, EmphasisBars, Figure, Heading, Muted, SolidButton } from './parts';

function KpiDemo() {
  return (
    <DemoCard>
      <Muted>Grid usage, October</Muted>
      <Figure>1,284 kWh</Figure>
      <Muted>8.2% lower than September</Muted>
      <EmphasisBars />
    </DemoCard>
  );
}

function SliderDemo() {
  return (
    <DemoCard>
      <Muted>Carbon price, per tonne</Muted>
      <span className="my-(--bb-space-2) flex items-center" aria-hidden>
        <span className="block h-1 w-3/5 bg-bb-accent" />
        <span className="-mx-1.5 block size-3 rounded-full bg-bb-accent" />
        <span className="block h-1 flex-1 bg-bb-border" />
      </span>
      <Figure>£85</Figure>
      <Muted>Cuts emissions 18 to 24% by 2035</Muted>
    </DemoCard>
  );
}

function MapDemo() {
  return (
    <DemoCard>
      <Heading>Bus reliability</Heading>
      <Muted>Share of services on time, by borough</Muted>
      <EmphasisBars />
      <span className="mt-1 flex justify-between">
        <Muted>Below 70%</Muted>
        <Muted>Above 95%</Muted>
      </span>
    </DemoCard>
  );
}

function FormDemo() {
  return (
    <DemoCard>
      <Heading>Notifications</Heading>
      <Muted>Weekly summary email</Muted>
      <span className="my-(--bb-space-1) block rounded-bb-control border border-bb-border bg-bb-background px-(--bb-space-2) py-(--bb-space-1) text-bb-muted">
        sam@northwind.example
      </span>
      <SolidButton>Save changes</SolidButton>
    </DemoCard>
  );
}

function ChatDemo() {
  return (
    <span className="flex w-full flex-col gap-(--bb-space-2)">
      <span className="max-w-4/5 self-end rounded-bb-card bg-bb-accent px-(--bb-space-3) py-(--bb-space-2) text-bb-on-accent">
        Which routes run late most often?
      </span>
      <DemoCard>
        <span className="block text-bb-text">
          Routes 12 and 38, mostly between 8am and 9am on weekdays.
        </span>
        <EmphasisBars />
      </DemoCard>
    </span>
  );
}

function HeroDemo() {
  return (
    <DemoCard>
      <Heading>Solar for every rooftop</Heading>
      <Muted>Panels, install and a 25-year warranty for one monthly price.</Muted>
      <SolidButton>Get a quote</SolidButton>
      <EmphasisBars />
    </DemoCard>
  );
}

function ArticleDemo() {
  return (
    <DemoCard>
      <Muted>Supply chains</Muted>
      <Heading>The long road to a battery</Heading>
      <span className="mt-(--bb-space-2) block border-l-2 border-bb-emphasis-2 pl-(--bb-space-2) text-bb-text">
        Most lithium crosses three borders before reaching a factory.
      </span>
      <EmphasisBars />
    </DemoCard>
  );
}

function DocsDemo() {
  return (
    <DemoCard>
      <Heading>Quick start</Heading>
      <Muted>Install the client, then add your first route.</Muted>
      <span className="mt-(--bb-space-2) block rounded-bb-control bg-bb-background px-(--bb-space-2) py-(--bb-space-1) font-bb-mono text-bb-text">
        npm install transit-kit
      </span>
      <EmphasisBars />
    </DemoCard>
  );
}

/** The mini component each project type is judged on in This or That. */
export const DEMOS: Record<SceneFamily, ComponentType> = {
  dashboard: KpiDemo,
  simulator: SliderDemo,
  map: MapDemo,
  app: FormDemo,
  chat: ChatDemo,
  marketing: HeroDemo,
  editorial: ArticleDemo,
  docs: DocsDemo,
};
