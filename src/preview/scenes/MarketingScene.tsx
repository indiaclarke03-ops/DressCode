import { marketingCopy, sceneName } from './content';
import { Btn, Display, Figure, Muted, Panel, Picture, Subtitle, Tag, Text, type ButtonStyle } from './parts';
import { option, type SceneProps } from './types';

const PRODUCTS = [
  { name: 'Block plane', price: '£84', detail: 'Cast iron, No. 60' },
  { name: 'Marking gauge', price: '£32', detail: 'Rosewood and brass' },
  { name: 'Bench chisels', price: '£118', detail: 'Set of four' },
  { name: 'Try square', price: '£41', detail: '200 mm, hardened' },
  { name: 'Spokeshave', price: '£76', detail: 'Adjustable mouth' },
  { name: 'Marking knife', price: '£28', detail: 'Ash handle' },
  { name: 'Card scraper', price: '£14', detail: 'Set of three' },
  { name: 'Mallet', price: '£52', detail: 'Beech, 16 oz' },
];

const ROWS_SHOWN = 2;
const PRODUCTS_PER_ROW: Record<string, number> = { two: 2, three: 3, four: 4 };

const GRID_COLUMNS: Record<string, string> = {
  two: '@3xl:grid-cols-2',
  three: '@3xl:grid-cols-3',
  four: '@3xl:grid-cols-4',
};

const SHAPE_COUNT: Record<string, number> = { subtle: 2, lively: 5, 'over-the-top': 9 };
const PULSE_COUNT: Record<string, number> = { minimal: 2, moderate: 5, full: 10 };

const topicLabel = (config: SceneProps['config']) => sceneName(config.projectType).topic;

function Storefront({ config }: SceneProps) {
  const card = option(config, 'productCard', 'image-and-details');
  const quietPrice = option(config, 'priceEmphasis', 'bold') === 'quiet';
  const density = option(config, 'gridDensity', 'three');
  const columns = GRID_COLUMNS[density] ?? '';
  const shown = PRODUCTS.slice(0, (PRODUCTS_PER_ROW[density] ?? 3) * ROWS_SHOWN);
  const compact = card === 'compact-list';

  return (
    <div className={`grid gap-bb-3 ${compact ? '' : `grid-cols-2 ${columns}`}`}>
      {shown.map((product) => (
        <Panel key={product.name} className={`overflow-hidden ${compact ? 'flex items-center gap-bb-3 p-bb-2' : ''}`}>
          {compact ? null : (
            <Picture label={product.name} className={card === 'big-image' ? 'aspect-square' : 'aspect-[3/2]'} />
          )}
          <div className={compact ? 'flex flex-1 items-center justify-between gap-bb-2' : 'p-bb-2'}>
            <div>
              <Subtitle>{product.name}</Subtitle>
              {card === 'big-image' ? null : <Muted>{product.detail}</Muted>}
            </div>
            {quietPrice ? <Muted>{product.price}</Muted> : <Figure>{product.price}</Figure>}
          </div>
        </Panel>
      ))}
    </div>
  );
}

function Hero({ config, buttonKind }: SceneProps & { buttonKind: ButtonStyle }) {
  const { topic } = sceneName(config.projectType);
  const heroStyle = option(config, 'heroStyle', 'headline-and-image');
  const { lede, cta, hint } = marketingCopy(config.projectType);
  const text = (
    <div className="flex flex-col items-start gap-bb-3">
      <Display>{topic}</Display>
      <Text className="text-bb-muted">{lede}</Text>
      <div className="flex flex-wrap items-center gap-bb-2">
        <Btn kind={buttonKind}>{cta}</Btn>
        <Muted>{hint}</Muted>
      </div>
    </div>
  );

  if (heroStyle === 'big-headline') return <div data-reveal className="max-w-3xl">{text}</div>;
  if (heroStyle === 'product-shot') {
    return (
      <div className="flex flex-col gap-bb-4">
        <div data-reveal className="max-w-3xl">{text}</div>
        <Panel className="overflow-hidden">
          <Picture label={topicLabel(config)} className="h-56" />
        </Panel>
      </div>
    );
  }
  return (
    <div className="grid items-center gap-bb-4 @3xl:grid-cols-2 @3xl:editorial:grid-cols-[3fr_2fr] poster:grid-cols-1">
      <div data-reveal>{text}</div>
      <Panel className="overflow-hidden">
        <Picture label={topicLabel(config)} className="h-56" />
      </Panel>
    </div>
  );
}

function Playful({ config }: SceneProps) {
  const shapes = SHAPE_COUNT[option(config, 'playfulness', 'lively')] ?? 0;
  const pulses = PULSE_COUNT[option(config, 'intensity', 'moderate')] ?? 0;
  return (
    <Panel className="flex items-end justify-between gap-bb-3 p-bb-3">
      <div className="flex flex-wrap gap-bb-1">
        {Array.from({ length: shapes }, (_, index) => (
          <span key={index} className={`block size-6 rounded-bb-control ${index % 2 ? 'bg-bb-emphasis-2' : 'bg-bb-emphasis-1'}`} />
        ))}
      </div>
      <div className="flex items-end gap-1" aria-label={`${pulses} intensity bars`}>
        {Array.from({ length: pulses }, (_, index) => (
          <span key={index} className="block w-1.5 bg-bb-accent" style={{ height: 6 + index * 3 }} />
        ))}
      </div>
    </Panel>
  );
}

export default function MarketingScene(props: SceneProps) {
  const { config } = props;
  const { brand } = sceneName(config.projectType);
  const buttonKind = option(config, 'buttonStyle', 'solid') as ButtonStyle;
  const rhythm = option(config, 'sectionRhythm', 'even-and-steady');
  const isShop = config.projectType === 'ecommerce';
  const copy = marketingCopy(config.projectType);

  return (
    <div className="flex flex-col gap-bb-6 p-bb-4">
      <header className="bb-band -mx-bb-4 -mt-bb-4 flex items-center justify-between gap-bb-3 p-bb-3">
        <Subtitle>{brand}</Subtitle>
        <nav className="hidden gap-bb-3 text-bb-1 text-bb-muted @3xl:flex">
          <span>About</span>
          <span>{copy.plansTitle}</span>
          <span>Contact</span>
        </nav>
        <Btn kind="outlined">{isShop ? 'Basket (2)' : 'Sign in'}</Btn>
      </header>

      {isShop ? null : <Hero {...props} buttonKind={buttonKind} />}
      {isShop ? (
        <>
          <Display>{sceneName(config.projectType).topic}</Display>
          <Storefront {...props} />
        </>
      ) : null}
      {config.projectType === 'game' ? <Playful {...props} /> : null}

      <div className="flex flex-wrap items-center gap-bb-3 border-y border-bb-border py-bb-2">
        <Muted>{copy.logosLabel}</Muted>
        {copy.logos.map((logo) => (
          <span key={logo} className="font-bb-heading text-bb-3 text-bb-muted">{logo}</span>
        ))}
      </div>

      <div
        data-rhythm={rhythm}
        className={
          rhythm === 'alternating'
            ? 'flex flex-col gap-bb-4'
            : rhythm === 'big-full-width-moments'
              ? 'flex flex-col gap-bb-5'
              : 'grid gap-bb-3 @3xl:grid-cols-3 @3xl:editorial:grid-cols-[2fr_1fr_1fr] @3xl:bento:grid-cols-2 @3xl:bento:*:first:col-span-2 poster:grid-cols-1'
        }
      >
        {copy.features.map((feature, index) => (
          <Panel
            key={feature.title}
            className={
              rhythm === 'alternating'
                ? `max-w-3/5 p-bb-3 ${index % 2 ? 'self-end' : ''}`
                : rhythm === 'big-full-width-moments'
                  ? 'bg-bb-accent p-bb-5 text-bb-on-accent [&_*]:text-bb-on-accent'
                  : 'p-bb-3'
            }
          >
            <Subtitle>{feature.title}</Subtitle>
            <Muted className="mt-1">{feature.text}</Muted>
          </Panel>
        ))}
      </div>

      {isShop ? null : (
        <div className="grid gap-bb-3 @3xl:grid-cols-3">
          {copy.plans.map((plan, index) => (
            <Panel key={plan.name} className="flex flex-col gap-1 p-bb-3">
              <div className="flex items-center justify-between">
                <Subtitle>{plan.name}</Subtitle>
                {index === 1 && config.projectType === 'marketing' ? (
                  <Tag tone="accent">Most chosen</Tag>
                ) : null}
              </div>
              <Figure>{plan.price}</Figure>
              <Muted>{plan.detail}</Muted>
            </Panel>
          ))}
        </div>
      )}

      <footer className="flex justify-between gap-bb-3 border-t border-bb-border pt-bb-3">
        <Muted>{brand}</Muted>
        <Muted>Privacy, terms, contact</Muted>
      </footer>
    </div>
  );
}
