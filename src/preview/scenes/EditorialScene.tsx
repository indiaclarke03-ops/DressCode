import { sceneName } from './content';
import { AnnotatedTrend } from './charts';
import { Btn, Display, Muted, Panel, Picture, Subtitle, Tag, Text, Title } from './parts';
import { option, type SceneProps } from './types';

const WIDTHS: Record<string, string> = {
  narrow: 'max-w-lg',
  medium: 'max-w-2xl',
  wide: 'max-w-4xl',
};

const ARTICLE = {
  byline: 'By Hanna Lindqvist. 9 minute read.',
  intro:
    'The lithium in a phone battery may cross three borders before it reaches a cell factory. Each stop adds cost, emissions and another chance for the record to go missing.',
  quote: '"Nobody along the chain can see the whole of it."',
  quoteSource: 'Procurement lead, cell manufacturer',
  body: "Refining remains concentrated. Three companies processed more than half of last year's supply, which leaves buyers exposed when a single plant goes offline.",
  chart: 'Recycled share of battery material',
  callout: 'What this means for buyers',
  calloutText: 'Traceability rules take effect in 2027, so records matter now.',
};

const LESSON = {
  byline: 'Lesson 3 of 6. About 10 minutes.',
  intro:
    'A heat pump does not make heat. It collects warmth that is already outdoors, even in cold air, and concentrates it, much like a fridge running in reverse.',
  quote: '"For every unit of electricity, you get about three units of heat."',
  quoteSource: 'The idea to remember',
  body: 'A refrigerant soaks up outdoor warmth and turns to gas. Squeezing that gas makes it hotter, and the heat passes into your radiators.',
  chart: 'Heat pumps in UK homes',
  callout: 'Try this at home',
  calloutText: 'Feel the back of your fridge. That warmth came from inside it.',
};

const QUIZ = ['It moves heat', 'It burns less gas', 'It stores electricity'];

function Lede({ config }: SceneProps) {
  const treatment = option(config, 'imageTreatment', 'inside-the-text-column');
  if (config.projectType !== 'editorial') return null;
  const frame: Record<string, string> = {
    'full-width': '-mx-bb-4',
    'inside-the-text-column': '',
    'framed-with-a-border': 'border border-bb-border p-bb-2',
  };
  return (
    <figure data-reveal data-image={treatment} className={`m-0 ${frame[treatment] ?? ''}`}>
      <Picture label="A container ship at a quay" className="h-52" />
      <figcaption className="mt-1">
        <Muted>Lithium concentrate leaving Antofagasta. Sample image.</Muted>
      </figcaption>
    </figure>
  );
}

function CheckIn({ kind }: { kind: string }) {
  if (kind === 'no-check-ins') return null;
  if (kind === 'reflection-prompts') {
    return (
      <Panel className="p-bb-3">
        <Subtitle>Stop and think</Subtitle>
        <Text className="mt-1">Why would a heat pump work harder on the coldest day of the year?</Text>
      </Panel>
    );
  }
  return (
    <Panel className="flex flex-col gap-bb-1 p-bb-3">
      <Subtitle>Quick check</Subtitle>
      <Text>What does a heat pump actually do?</Text>
      {QUIZ.map((answer, index) => (
        <span key={answer} className={`rounded-bb-control border px-bb-2 py-1 text-bb-1 ${index === 0 ? 'border-bb-accent text-bb-accent-text' : 'border-bb-border text-bb-text'}`}>
          {answer}
        </span>
      ))}
    </Panel>
  );
}

function Explorer({ flow }: { flow: string }) {
  if (flow === 'step-by-step') {
    return (
      <div className="flex items-center justify-between">
        <Muted>Step 2 of 5</Muted>
        <Btn>Next step</Btn>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-bb-1">
      {['Compressor', 'Refrigerant', 'Outdoor unit', 'Radiators'].map((part) => (
        <Tag key={part}>{part}</Tag>
      ))}
    </div>
  );
}

export default function EditorialScene(props: SceneProps) {
  const { config } = props;
  const { brand, topic } = sceneName(config.projectType);
  const width = option(config, 'readingWidth', option(config, 'contentWidth', 'medium'));
  const callouts = option(config, 'chartAnnotation', 'callouts') === 'callouts';
  const scrollTriggered = option(config, 'sectionTransitions', 'static') === 'as-you-scroll';
  const isExplainer = config.projectType === 'explainer';
  const copy = isExplainer ? LESSON : ARTICLE;

  return (
    <div className="p-bb-4 poster:p-bb-5">
      <article
        data-width={width}
        className={`flex flex-col gap-bb-3 @3xl:editorial:ml-[calc(var(--bb-content-offset)/var(--bb-columns)*100%)] ${WIDTHS[width] ?? WIDTHS.medium} poster:max-w-none ${scrollTriggered ? 'border-l-2 border-bb-accent pl-bb-3' : ''}`}
      >
        <Muted>{brand}</Muted>
        <Display>{topic}</Display>
        <Muted>{copy.byline}</Muted>
        <Lede {...props} />

        <Text>{copy.intro}</Text>

        {isExplainer ? <Explorer flow={option(config, 'learningFlow', 'step-by-step')} /> : null}

        <blockquote data-reveal className="m-0 border-l-2 border-bb-emphasis-2 pl-bb-3">
          <Title>{copy.quote}</Title>
          <Muted className="mt-1">{copy.quoteSource}</Muted>
        </blockquote>

        <Text>{copy.body}</Text>

        <Panel className="p-bb-3">
          <Subtitle>{copy.chart}</Subtitle>
          <Muted className="mb-bb-2">Per cent of supply, sample data</Muted>
          <AnnotatedTrend callouts={callouts} />
        </Panel>

        <aside data-reveal className="bb-band rounded-bb-card p-bb-3">
          <Subtitle>{copy.callout}</Subtitle>
          <Text className="mt-1">{copy.calloutText}</Text>
        </aside>

        {isExplainer ? <CheckIn kind={option(config, 'checkIns', 'short-quizzes')} /> : null}
      </article>
    </div>
  );
}
