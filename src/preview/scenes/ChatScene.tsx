import { sceneName } from './content';
import { Btn, Muted, Panel, Subtitle, Tag, Text, Title } from './parts';
import { option, type SceneProps } from './types';

const THREAD = [
  { from: 'user', text: 'Which of our suppliers ship through a single port?' },
  {
    from: 'assistant',
    text: 'Four of your 26 tier-one suppliers rely on Rotterdam alone. Two of them supply battery casings, so a port closure would stop line 3 within nine days.',
  },
  { from: 'user', text: 'Which alternative port adds the least time?' },
  {
    from: 'assistant',
    text: 'Antwerp adds about a day and a half. Hamburg adds three, but has spare container capacity through March.',
  },
];

const SOURCES = [
  { title: 'Q3 shipment records', detail: '1,204 rows' },
  { title: 'Supplier contracts 2026', detail: '26 documents' },
  { title: 'Port capacity bulletin', detail: 'October' },
];

function Message({ from, text, bubbles }: { from: string; text: string; bubbles: boolean }) {
  const isUser = from === 'user';
  if (!bubbles) {
    return (
      <div data-reveal className="border-b border-bb-border py-bb-2">
        <Muted>{isUser ? 'You' : 'Routewise'}</Muted>
        <Text>{text}</Text>
      </div>
    );
  }
  return (
    <div
      data-reveal
      className={`max-w-4/5 rounded-bb-card px-bb-3 py-bb-2 ${isUser ? 'self-end bg-bb-accent text-bb-on-accent' : 'self-start border-(length:--bb-border-width) border-bb-border bg-bb-surface text-bb-text shadow-bb-card'}`}
    >
      <p className="m-0 text-bb-2">{text}</p>
    </div>
  );
}

export default function ChatScene({ config }: SceneProps) {
  const { brand, topic } = sceneName(config.projectType);
  const bubbles = option(config, 'messageStyle', 'bubbles') === 'bubbles';
  const centred = option(config, 'inputPosition', 'fixed-at-the-bottom') === 'centred';
  const sources = option(config, 'sourcesPanel', 'yes') === 'yes';

  const input = (
    <Panel className="flex items-center justify-between gap-bb-2 p-bb-2">
      <Muted>Ask about your supply chain</Muted>
      <Btn>Send</Btn>
    </Panel>
  );

  return (
    <div className={`grid min-h-full ${sources ? '@3xl:grid-cols-[1fr_17rem]' : ''}`}>
      <div className="flex min-w-0 flex-col gap-bb-3 p-bb-4">
        <header>
          <Muted>{brand}</Muted>
          <Title>{topic}</Title>
        </header>
        {centred ? <div className="mx-auto w-full max-w-lg">{input}</div> : null}
        <div className={`flex flex-col ${bubbles ? 'gap-bb-2' : ''}`}>
          {THREAD.map((message) => (
            <Message key={message.text} {...message} bubbles={bubbles} />
          ))}
        </div>
        {centred ? null : <div className="mt-auto">{input}</div>}
      </div>
      {sources ? (
        <aside className="border-t border-bb-border p-bb-3 @3xl:border-t-0 @3xl:border-l">
          <Subtitle className="mb-bb-2">Sources</Subtitle>
          <div className="flex flex-col gap-bb-2">
            {SOURCES.map((source) => (
              <div key={source.title}>
                <Text>{source.title}</Text>
                <Tag>{source.detail}</Tag>
              </div>
            ))}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
