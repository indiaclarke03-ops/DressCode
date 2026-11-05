import { useConfig } from '@/app/ConfigContext';
import { ChoiceCard, ChoiceGroup } from '@/components/ui/ChoiceCard';
import { PROJECT_QUESTIONS } from './projectQuestions';

export function ProjectDetails() {
  const { config, dispatch } = useConfig();

  return (
    <div className="flex flex-col gap-8">
      {PROJECT_QUESTIONS[config.projectType].map((question) => (
        <section key={question.id}>
          <h2 className="mt-0 mb-3 text-base font-medium text-ink">{question.label}</h2>
          <ChoiceGroup
            label={question.label}
            value={String(config.projectOptions[question.id] ?? '')}
            onValueChange={(value) =>
              dispatch({ type: 'setProjectOption', key: question.id, value })
            }
            className="grid gap-3 @md:grid-cols-2 @2xl:grid-cols-3"
          >
            {question.options.map((option) => (
              <ChoiceCard key={option.id} value={option.id} title={option.label} />
            ))}
          </ChoiceGroup>
        </section>
      ))}
      <p className="m-0 text-sm text-muted">Skip anything you're unsure about.</p>
    </div>
  );
}
