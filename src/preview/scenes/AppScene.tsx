import { sceneName } from './content';
import { DataTable, type TableStyle } from './DataTable';
import { Btn, Field, MobileBrand, Muted, NavItem, Panel, Subtitle, Switch, Title, type FieldStyle } from './parts';
import { option, type SceneProps } from './types';

const NAV = ['General', 'Team', 'Notifications', 'Billing'];

const MEMBERS = [
  ['Sam Whitlock', 'Admin', '2 hrs ago'],
  ['Priya Nair', 'Editor', 'Yesterday'],
  ['Tomás Reyes', 'Viewer', '3 days ago'],
];

const SURVEY = [
  { label: 'Which line do you use most?', value: 'Route 38' },
  { label: 'How often do you ride?', value: 'Most weekdays' },
  { label: 'What would improve your trip?', value: 'More evening services' },
];

function Progress({ kind }: { kind: string }) {
  if (kind === 'not-at-all') return null;
  if (kind === 'numbered-steps') {
    return (
      <ol className="m-0 flex list-none gap-bb-1 p-0">
        {[1, 2, 3, 4].map((step) => (
          <li
            key={step}
            className={`flex size-7 items-center justify-center rounded-full text-bb-1 ${step === 1 ? 'bg-bb-accent text-bb-on-accent' : 'border border-bb-border text-bb-muted'}`}
          >
            {step}
          </li>
        ))}
      </ol>
    );
  }
  return (
    <div className="h-1.5 bg-bb-border">
      <div className="h-1.5 w-1/4 bg-bb-accent" />
    </div>
  );
}

function SurveyScene({ config, title, brand }: { config: SceneProps['config']; title: string; brand: string }) {
  const oneAtATime = option(config, 'formFlow', 'one-at-a-time') === 'one-at-a-time';
  const fieldStyle = option(config, 'inputStyle', 'outlined') as FieldStyle;
  const questions = oneAtATime ? SURVEY.slice(0, 1) : SURVEY;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-bb-3 p-bb-4">
      <Muted>{brand}</Muted>
      <Title>{title}</Title>
      <Progress kind={option(config, 'progressStyle', 'a-bar')} />
      <Panel className="flex flex-col gap-bb-3 p-bb-4">
        {questions.map((question) => (
          <Field key={question.label} kind={fieldStyle} {...question} />
        ))}
        <div className="flex justify-end">
          <Btn>{oneAtATime ? 'Next question' : 'Submit answers'}</Btn>
        </div>
      </Panel>
      <Muted>Your answers are anonymous and help plan next year's timetable.</Muted>
    </div>
  );
}

export default function AppScene({ config }: SceneProps) {
  const { brand, topic } = sceneName(config.projectType);
  if (config.projectType === 'form') {
    return <SurveyScene config={config} title={topic} brand={brand} />;
  }

  const nav = option(config, 'nav', 'sidebar');
  const fieldStyle = option(config, 'formStyle', 'outlined') as FieldStyle;
  const tableStyle = option(config, 'tableStyle', 'lines-between-rows') as TableStyle;
  const illustrated = option(config, 'emptyStates', 'an-illustration') === 'an-illustration';

  const navItems = NAV.map((item, index) => (
    <NavItem key={item} active={index === 0}>
      {item}
    </NavItem>
  ));

  return (
    <div className="flex min-h-full">
      {nav !== 'top-bar' ? (
        <aside className="bb-band hidden w-44 shrink-0 border-r border-bb-border p-bb-3 @3xl:block">
          <Subtitle className="mb-bb-3">{brand}</Subtitle>
          {navItems}
        </aside>
      ) : null}
      <div className="min-w-0 flex-1">
        {nav === 'sidebar' ? <MobileBrand brand={brand} /> : null}
        {nav !== 'sidebar' ? (
          <header className="bb-band flex items-center gap-bb-3 overflow-hidden border-b border-bb-border px-bb-4 py-bb-2">
            <Subtitle className="shrink-0">{brand}</Subtitle>
            <nav className="flex gap-bb-1">{navItems}</nav>
          </header>
        ) : null}
        <main className="flex flex-col gap-bb-4 p-bb-4">
          <div>
            <Title>{topic}</Title>
            <Muted>Changes save for everyone in your workspace.</Muted>
          </div>
          <div className="grid gap-bb-3 @3xl:grid-cols-2 @3xl:editorial:grid-cols-[3fr_2fr] @3xl:bento:grid-cols-[2fr_1fr] poster:grid-cols-1">
            <Panel className="flex flex-col gap-bb-3 p-bb-3">
              <Subtitle>Details</Subtitle>
              <Field label="Workspace name" value="Northwind Freight" kind={fieldStyle} />
              <Field label="Billing email" value="accounts@northwind.example" kind={fieldStyle} />
              <Switch label="Weekly summary email" on />
              <Switch label="Require two-step sign-in" on={false} />
              <div className="flex flex-wrap gap-bb-2">
                <Btn>Save changes</Btn>
                <Btn kind="outlined">Delete workspace</Btn>
              </div>
            </Panel>
            <Panel className="flex flex-col items-center justify-center gap-bb-2 p-bb-4 text-center">
              {illustrated ? (
                <svg aria-hidden viewBox="0 0 120 80" className="h-20">
                  <rect x="20" y="24" width="80" height="48" rx="4" className="fill-bb-background stroke-bb-muted" />
                  <path d="M20 40h80" className="stroke-bb-muted" />
                  <circle cx="60" cy="16" r="10" className="fill-bb-accent" />
                </svg>
              ) : null}
              <Subtitle>No integrations yet</Subtitle>
              <Muted>Connect your freight system to sync shipments automatically.</Muted>
              <Btn kind="outlined">Add an integration</Btn>
            </Panel>
          </div>
          <Panel className="p-bb-3">
            <Subtitle className="mb-bb-2">Team</Subtitle>
            <DataTable
              columns={['Name', 'Role', 'Last active']}
              rows={MEMBERS}
              numericFrom={3}
              variant={tableStyle}
            />
          </Panel>
        </main>
      </div>
    </div>
  );
}
