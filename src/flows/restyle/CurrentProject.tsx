import { ImageUp, X } from 'lucide-react';
import { useState, type ChangeEvent, type DragEvent } from 'react';
import { useConfig } from '@/app/ConfigContext';
import { Button } from '@/components/ui/Button';
import { ChoiceCard, ChoiceGroup } from '@/components/ui/ChoiceCard';
import { PaletteStrip } from '@/flows/shared/PaletteStrip';
import { ProjectType } from '@/flows/shared/ProjectType';
import { autoColorMap } from '@/restyle/autoColorMap';
import { extractImageColors } from '@/restyle/extractImageColors';
import { hasStyles, parseStyles } from '@/restyle/parseStyles';
import { STYLING_SYSTEMS } from '@/restyle/stylingSystems';
import type { ExtractedStyles } from '@/tokens/types';

const HEADING = 'mt-0 mb-1 text-base font-medium text-ink';
const NOTE = 'mt-0 mb-3 text-sm text-muted';
const EMPTY: ExtractedStyles = { colors: [], fonts: [], radii: [], shadows: [] };

function Facts({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <p className="m-0 text-sm text-ink">
      <span className="text-muted">{label}: </span>
      <span className="font-mono text-label">{values.join(', ')}</span>
    </p>
  );
}

export function CurrentProject() {
  const { config, dispatch } = useConfig();
  const restyle = config.restyle;
  const [pasted, setPasted] = useState('');
  const [imageColours, setImageColours] = useState<string[]>([]);
  const [imageNote, setImageNote] = useState('');
  const [dragging, setDragging] = useState(false);

  const apply = (styles: ExtractedStyles, fromImage: string[]) => {
    const colors = [...new Set([...styles.colors, ...fromImage])];
    const extracted = { ...styles, colors };
    dispatch({
      type: 'setRestyle',
      patch: hasStyles(extracted)
        ? { extracted, colorMap: autoColorMap(colors) }
        : { extracted: undefined, colorMap: {} },
    });
  };

  const onPaste = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPasted(event.target.value);
    apply(parseStyles(event.target.value), imageColours);
  };

  const readImage = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageNote('That file is not an image. Try a PNG or JPG.');
      return;
    }
    try {
      const colours = await extractImageColors(file);
      setImageColours(colours);
      setImageNote(`Read ${colours.length} colours from ${file.name}.`);
      apply(pasted ? parseStyles(pasted) : (config.restyle?.extracted ?? EMPTY), colours);
    } catch {
      setImageNote("We couldn't read that image. Try a PNG or JPG.");
    }
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    void readImage(event.dataTransfer.files[0]);
  };

  const clear = () => {
    setPasted('');
    setImageColours([]);
    setImageNote('');
    apply(EMPTY, []);
  };

  const extracted = restyle?.extracted;

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className={HEADING}>What is it?</h2>
        <p className={NOTE}>Pick the closest match.</p>
        <ProjectType />
      </section>

      <section>
        <h2 className={HEADING}>How is it styled now?</h2>
        <p className={NOTE}>If you're not sure, choose "Not sure". Your agent will work it out.</p>
        <ChoiceGroup
          label="How is it styled now?"
          value={restyle?.stylingSystem ?? 'unknown'}
          onValueChange={(stylingSystem) => dispatch({ type: 'setRestyle', patch: { stylingSystem } })}
          className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
        >
          {STYLING_SYSTEMS.map((system) => (
            <ChoiceCard key={system.id} value={system.id} title={system.label} />
          ))}
        </ChoiceGroup>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <label className="block">
            <span className={`block ${HEADING}`}>Paste your current styles (optional)</span>
            <span className={`block ${NOTE}`}>
              CSS, a Tailwind config, a theme file or a list of colours. It stays in your browser
              and is never uploaded.
            </span>
            <textarea
              value={pasted}
              onChange={onPaste}
              rows={9}
              spellCheck={false}
              placeholder="--brand: #6C5CE7;"
              className="w-full rounded-button border border-line-strong bg-surface p-3 font-mono text-sm text-ink placeholder:text-muted"
            />
          </label>
        </div>

        <div>
          <p className={HEADING}>Or add a screenshot (optional)</p>
          <p className={NOTE}>We'll read its main colours. The image stays in your browser.</p>
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed p-6 text-center text-sm text-muted transition-colors duration-150 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent ${dragging ? 'border-accent' : 'border-line-strong'}`}
          >
            <ImageUp aria-hidden size={22} strokeWidth={1.5} />
            Drop an image here, or click to choose one
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                void readImage(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
          </label>
          <p aria-live="polite" className="mt-2 mb-0 text-sm text-muted empty:hidden">
            {imageNote}
          </p>
        </div>
      </section>

      {extracted ? (
        <section className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="m-0 text-base font-medium text-ink">What we found</h2>
            <Button variant="ghost" onClick={clear}>
              <X aria-hidden size={16} />
              Clear
            </Button>
          </div>
          {extracted.colors.length ? (
            <PaletteStrip label="Your current palette" colours={extracted.colors} />
          ) : null}
          <Facts label="Fonts" values={extracted.fonts} />
          <Facts label="Corners" values={extracted.radii} />
          <Facts label="Shadows" values={extracted.shadows} />
        </section>
      ) : null}
    </div>
  );
}
