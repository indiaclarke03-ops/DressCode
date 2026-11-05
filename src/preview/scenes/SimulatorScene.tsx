import { sceneName } from './content';
import { ScenarioChart } from './charts';
import { DataTable } from './DataTable';
import { Btn, Muted, NavItem, Panel, Subtitle, Switch, Title } from './parts';
import { option, type SceneProps } from './types';

const CONTROLS = [
  { label: 'Carbon price per tonne', value: '£85', fill: 'w-3/5' },
  { label: 'Clean power by 2040', value: '72%', fill: 'w-4/5' },
  { label: 'Efficiency target', value: '1.4%', fill: 'w-2/5' },
];

const CALCULATOR_CONTROLS = [
  { label: 'Yearly gas bill', value: '£1,420', fill: 'w-3/5' },
  { label: 'Home size', value: '96 m²', fill: 'w-2/5' },
  { label: 'Insulation level', value: 'Good', fill: 'w-4/5' },
];

const BREAKDOWN = [
  ['Lower heating bills', '£640'],
  ['Maintenance saved', '£85'],
  ['Standing charge change', '-£40'],
];

function Control({ kind, label, value, fill }: { kind: string; label: string; value: string; fill: string }) {
  if (kind === 'steppers' || kind === 'number-boxes') {
    return (
      <div className="flex items-center justify-between gap-bb-2 py-bb-1">
        <Muted>{label}</Muted>
        <span className="flex items-center gap-1 rounded-bb-control border border-bb-border px-bb-2 py-0.5 font-bb-mono text-bb-1 text-bb-text">
          {kind === 'steppers' ? <span className="text-bb-accent">−</span> : null}
          {value}
          {kind === 'steppers' ? <span className="text-bb-accent">+</span> : null}
        </span>
      </div>
    );
  }
  return (
    <div className="py-bb-1">
      <div className="flex justify-between">
        <Muted>{label}</Muted>
        <Muted className="font-bb-mono">{value}</Muted>
      </div>
      <div className="mt-1 h-1 bg-bb-border">
        <div className={`relative h-1 bg-bb-accent ${fill}`}>
          <span className="absolute -top-1.5 -right-2 block size-4 rounded-full border-2 border-bb-accent bg-bb-raised" />
        </div>
      </div>
    </div>
  );
}

export default function SimulatorScene({ config }: SceneProps) {
  const { brand, topic } = sceneName(config.projectType);
  const isCalculator = config.projectType === 'calculator';
  const controlStyle = option(config, 'controlStyle', 'sliders');
  const layoutStyle = option(config, 'layoutStyle', 'left-with-results-on-the-right');
  const emphasis = option(config, 'outputEmphasis', 'both');
  const uncertainty = option(config, 'showUncertainty', 'yes') === 'yes';
  const placement = option(config, 'resultPlacement', 'beside-the-inputs');
  const needsButton = option(config, 'updateMode', 'as-you-type') === 'with-a-calculate-button';
  const breakdown = option(config, 'showBreakdown', 'yes') === 'yes';

  const stacked =
    layoutStyle === 'along-the-top' || (isCalculator && placement === 'below-the-inputs');
  const floating = layoutStyle === 'in-a-floating-panel';
  const fixedResult = isCalculator && placement === 'fixed-in-view';

  const controls = (
    <Panel className={`p-bb-3 ${floating ? '@3xl:absolute @3xl:top-bb-3 @3xl:left-bb-3 @3xl:z-10 @3xl:w-72' : ''}`}>
      <Subtitle className="mb-bb-2">{isCalculator ? 'Your home' : 'Assumptions'}</Subtitle>
      <div className={stacked ? 'grid gap-x-bb-4 @3xl:grid-cols-3' : ''}>
        {(isCalculator ? CALCULATOR_CONTROLS : CONTROLS).map((control) => (
          <Control key={control.label} kind={controlStyle} {...control} />
        ))}
      </div>
      <Switch label={isCalculator ? 'Keep the gas hob' : 'Include aviation'} on />
      <Switch label={isCalculator ? 'Add a smart tariff' : 'Assume faster grid build'} on={false} />
      {needsButton ? <Btn className="mt-bb-2">Calculate</Btn> : null}
    </Panel>
  );

  const showNumber = emphasis !== 'a-chart';
  const output = (
    <Panel className={`p-bb-4 ${fixedResult ? 'border-t-2 border-t-bb-accent' : ''}`}>
      <div className="mb-bb-3 flex gap-bb-1 border-b border-bb-border pb-bb-2">
        {(isCalculator ? ['Air source', 'Ground source', 'Hybrid'] : ['Central', 'Fast transition', 'Delayed']).map((tab, index) => (
          <NavItem key={tab} active={index === 0}>
            {tab}
          </NavItem>
        ))}
      </div>
      {showNumber ? (
        <>
          <Muted>{isCalculator ? 'Estimated yearly saving' : 'Emissions cut by 2040'}</Muted>
          <p className="m-0 font-bb-mono text-bb-7 leading-tight text-bb-accent tabular-nums">
            {isCalculator ? '£685' : '46%'}
          </p>
          <Muted>
            {isCalculator
              ? 'Based on current energy prices'
              : uncertainty
                ? 'Likely range 38% to 53%'
                : 'Central estimate'}
          </Muted>
        </>
      ) : null}
      {emphasis !== 'a-big-headline-number' ? (
        <div className="mt-bb-3">
          <ScenarioChart uncertainty={uncertainty} />
        </div>
      ) : null}
      {isCalculator && breakdown ? (
        <div className="mt-bb-3">
          <Subtitle className="mb-bb-1">How this was worked out</Subtitle>
          <DataTable columns={['Item', 'Per year']} rows={BREAKDOWN} />
        </div>
      ) : null}
    </Panel>
  );

  return (
    <div className="flex flex-col gap-bb-4 p-bb-4">
      <header>
        <Muted>{brand}</Muted>
        <Title>{topic}</Title>
      </header>
      <div
        className={
          stacked
            ? 'flex flex-col gap-bb-3'
            : `relative grid gap-bb-3 ${floating ? '' : '@3xl:grid-cols-[1fr_2fr] @3xl:editorial:grid-cols-[2fr_3fr]'}`
        }
      >
        {controls}
        {output}
      </div>
    </div>
  );
}
