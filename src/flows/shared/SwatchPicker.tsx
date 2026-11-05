import * as RadioGroup from '@radix-ui/react-radio-group';
import { Check } from 'lucide-react';
import { ACCENT_SWATCHES } from '@/tokens/defaults';
import { pickForeground } from '@/tokens/palette';

interface SwatchPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

export function SwatchPicker({ value, onChange }: SwatchPickerProps) {
  const isCurated = ACCENT_SWATCHES.some((swatch) => swatch.hex === value);

  return (
    <RadioGroup.Root
      aria-label="Accent colour"
      value={isCurated ? value : ''}
      onValueChange={onChange}
      className="flex flex-wrap gap-2"
    >
      {ACCENT_SWATCHES.map((swatch) => (
        <RadioGroup.Item
          key={swatch.hex}
          value={swatch.hex}
          aria-label={swatch.name}
          title={swatch.name}
          className="flex size-11 items-center justify-center rounded-button border border-line data-[state=checked]:ring-2 data-[state=checked]:ring-ink data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background"
          style={{ backgroundColor: swatch.hex, color: pickForeground(swatch.hex, '#111111') }}
        >
          <RadioGroup.Indicator>
            <Check aria-hidden size={18} strokeWidth={2.5} />
          </RadioGroup.Indicator>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
