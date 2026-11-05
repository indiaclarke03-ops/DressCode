import { useConfig } from '@/app/ConfigContext';
import { COLOR_ROLES } from '@/restyle/autoColorMap';

/** Lets people correct the automatic old-to-new guesses before exporting. */
export function ColorMapEditor() {
  const { config, tokens, dispatch } = useConfig();
  const colorMap = config.restyle?.colorMap ?? {};
  const entries = Object.entries(colorMap);
  if (entries.length === 0) return null;

  const newHex = (role: string) => {
    const key = role.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
    return Object.entries(tokens.colors).find(([name]) => name === key)?.[1] ?? '';
  };

  return (
    <section>
      <h2 className="mt-0 mb-1 font-display text-heading font-normal text-ink">Old colours to new</h2>
      <p className="mt-0 mb-4 max-w-reading text-sm text-muted">
        We matched each of your colours to its closest role. Change any that look wrong.
      </p>
      <ul className="m-0 grid list-none gap-x-8 gap-y-2 p-0 lg:grid-cols-2">
        {entries.map(([hex, role]) => (
          <li key={hex} className="flex items-center gap-3">
            <span
              aria-hidden
              className="size-8 shrink-0 rounded-button border border-line"
              style={{ backgroundColor: hex }}
            />
            <span className="w-20 shrink-0 font-mono text-label text-ink">{hex}</span>
            <select
              aria-label={`New role for ${hex}`}
              value={role}
              onChange={(event) =>
                dispatch({
                  type: 'setRestyle',
                  patch: { colorMap: { ...colorMap, [hex]: event.target.value } },
                })
              }
              className="min-h-11 min-w-0 flex-1 rounded-button border border-line-strong bg-surface px-2 text-base text-ink"
            >
              {COLOR_ROLES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="size-8 shrink-0 rounded-button border border-line"
              style={{ backgroundColor: newHex(role) }}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
