import { useConfig } from '@/app/ConfigContext';
import { ChoiceCard, ChoiceGroup } from '@/components/ui/ChoiceCard';
import { DEMOS } from '@/preview/demos';
import { TokenScope } from '@/preview/demos/TokenScope';
import { SCENE_FOR_PROJECT } from '@/tokens/defaults';
import { STYLE_DIRECTIONS } from '@/tokens/directions';
import { directionFields } from '@/tokens/presets';

const BASICS = 'basics';

export function Direction() {
  const { config, dispatch } = useConfig();
  const Demo = DEMOS[SCENE_FOR_PROJECT[config.projectType]];

  return (
    <ChoiceGroup
      label="Pick a starting look"
      value={config.direction || BASICS}
      onValueChange={(value) =>
        dispatch({ type: 'setDirection', id: value === BASICS ? '' : value })
      }
      className="grid gap-4 @xl:grid-cols-2"
    >
      {STYLE_DIRECTIONS.map((direction) => (
        <ChoiceCard
          key={direction.id}
          value={direction.id}
          title={direction.name}
          description={direction.description}
          illustration={
            <TokenScope config={{ ...config, ...directionFields(direction) }}>
              <Demo projectType={config.projectType} />
            </TokenScope>
          }
        />
      ))}
      <ChoiceCard
        value={BASICS}
        title="Start from the basics"
        description="A plain, neutral base. Build the whole look yourself in the next step."
      />
    </ChoiceGroup>
  );
}
