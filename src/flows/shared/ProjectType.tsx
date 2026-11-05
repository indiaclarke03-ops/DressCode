import { useConfig } from '@/app/ConfigContext';
import { ChoiceCard, ChoiceGroup } from '@/components/ui/ChoiceCard';
import { TextInput } from '@/components/ui/TextInput';
import type { ProjectType as ProjectTypeId } from '@/tokens/types';
import { PROJECT_TYPE_GROUPS } from './projectTypes';

const MAX_OTHER_LENGTH = 200;

export function ProjectType() {
  const { config, dispatch } = useConfig();

  return (
    <>
      <ChoiceGroup
        label="What are you building?"
        value={config.projectType}
        onValueChange={(value) =>
          dispatch({ type: 'setProjectType', projectType: value as ProjectTypeId })
        }
        className="flex flex-col gap-8"
      >
        {PROJECT_TYPE_GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="mt-0 mb-3 text-sm font-medium text-muted">{group.title}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.options.map(({ id, label, hint, icon: Icon }) => (
                <ChoiceCard
                  key={id}
                  value={id}
                  title={label}
                  description={hint}
                  illustration={<Icon aria-hidden size={22} strokeWidth={1.5} className="text-muted" />}
                />
              ))}
            </div>
          </section>
        ))}
      </ChoiceGroup>

      {config.projectType === 'other' ? (
        <label className="mt-6 block max-w-reading text-sm font-medium text-ink">
          What are you building?
          <TextInput
            className="mt-2 font-normal"
            maxLength={MAX_OTHER_LENGTH}
            placeholder="A garden planner for allotment groups"
            value={config.projectTypeOther ?? ''}
            onChange={(event) =>
              dispatch({ type: 'setProjectType', projectType: 'other', other: event.target.value })
            }
          />
        </label>
      ) : null}
    </>
  );
}
