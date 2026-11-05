import { generatePalette } from '@/tokens/palette';
import { sceneName } from './content';
import { MobileBrand, Muted, NavItem, Panel, Picture, Subtitle, Text, Title } from './parts';
import { option, type SceneProps } from './types';

const NAV = ['Introduction', 'Quick start', 'Routes', 'Timetables', 'Webhooks', 'Errors'];
const CONTENTS = ['Install', 'Add a route', 'Next steps'];

const CODE = `import { createClient } from 'transit-kit';

const client = createClient({ city: 'leeds' });
const route = await client.routes.get('38');`;

const WIDTHS: Record<string, string> = {
  narrow: 'max-w-lg',
  medium: 'max-w-2xl',
  wide: 'max-w-none',
};

const WORK = [
  { title: 'Tram wayfinding', detail: 'Signage system, Sheffield' },
  { title: 'Harbour Report', detail: 'Annual report, Port of Tyne' },
];

function Portfolio({ config }: SceneProps) {
  const { brand, topic } = sceneName(config.projectType);
  const width = option(config, 'contentWidth', 'medium');
  const treatment = option(config, 'imageTreatment', 'inside-the-text-column');
  const frame = treatment === 'framed-with-a-border' ? 'border border-bb-border p-bb-2' : '';

  return (
    <div data-width={width} className="p-bb-4">
      <div className={`mx-auto flex flex-col gap-bb-4 ${WIDTHS[width] ?? WIDTHS.medium}`}>
        <header>
          <Title>{brand}</Title>
          <Muted>Designer working on public services and transport</Muted>
        </header>
        <Subtitle>{topic}</Subtitle>
        {WORK.map((item) => (
          <article key={item.title} data-reveal data-image={treatment} className={treatment === 'full-width' ? '-mx-bb-4' : ''}>
            <div className={frame}>
              <Picture label={item.title} className="h-48" />
            </div>
            <Subtitle className="mt-bb-2">{item.title}</Subtitle>
            <Muted>{item.detail}</Muted>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function DocsScene(props: SceneProps) {
  const { config } = props;
  if (config.projectType === 'portfolio') return <Portfolio {...props} />;

  const { brand, topic } = sceneName(config.projectType);
  const width = option(config, 'contentWidth', 'medium');
  const treatment = option(config, 'imageTreatment', 'inside-the-text-column');
  const codeTheme = option(config, 'codeTheme', 'match-the-page');
  const codeColours =
    codeTheme === 'light' || codeTheme === 'dark'
      ? generatePalette(config.accent, config.neutral, codeTheme)
      : undefined;

  return (
    <div className="flex min-h-full">
      <aside className="hidden w-48 shrink-0 border-r border-bb-border p-bb-3 @3xl:block">
        <Subtitle className="mb-bb-3">{brand}</Subtitle>
        {NAV.map((item) => (
          <NavItem key={item} active={item === 'Quick start'}>
            {item}
          </NavItem>
        ))}
      </aside>

      <main className="min-w-0 flex-1">
        <MobileBrand brand={brand} />
        <article data-width={width} className={`flex flex-col gap-bb-3 p-bb-4 ${WIDTHS[width] ?? WIDTHS.medium}`}>
          <Muted>Getting started</Muted>
          <Title>{topic}</Title>
          <Text>Install the client, then fetch your first route in under five minutes.</Text>
          <Subtitle>Install</Subtitle>
          <pre
            data-reveal
            data-code={codeTheme}
            className="m-0 overflow-x-auto rounded-bb-control bg-bb-background p-bb-3 font-bb-mono text-bb-1 text-bb-text"
            style={codeColours ? { background: codeColours.background, color: codeColours.text } : undefined}
          >
            <code>{CODE}</code>
          </pre>
          <figure data-reveal data-image={treatment} className={`m-0 ${treatment === 'framed-with-a-border' ? 'border border-bb-border p-bb-2' : ''} ${treatment === 'full-width' ? 'w-full' : 'max-w-md'}`}>
            <Picture label="Route diagram" className="h-36" />
          </figure>
          <Panel className="p-bb-3">
            <Subtitle>Rate limits</Subtitle>
            <Muted className="mt-1">Free keys allow 60 requests a minute. Back off when you see a 429.</Muted>
          </Panel>
        </article>
      </main>

      <aside className="hidden w-40 shrink-0 p-bb-3 @5xl:block">
        <Muted className="mb-bb-1">On this page</Muted>
        {CONTENTS.map((item) => (
          <Muted key={item} className="py-0.5">{item}</Muted>
        ))}
      </aside>
    </div>
  );
}
