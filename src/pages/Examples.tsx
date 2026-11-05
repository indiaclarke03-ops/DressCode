import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CONFIG_PARAM, encodeConfig } from '@/lib/urlState';
import { DEMOS } from '@/preview/demos';
import { TokenScope } from '@/preview/demos/TokenScope';
import { SCENE_FOR_PROJECT } from '@/tokens/defaults';
import { deriveTokens } from '@/tokens/deriveTokens';
import { STYLE_PRESETS, type StylePreset } from '@/tokens/presets';

function ExampleCard({ preset }: { preset: StylePreset }) {
  const { config } = preset;
  const Demo = DEMOS[SCENE_FOR_PROJECT[config.projectType]];
  const fonts = useMemo(() => deriveTokens(config).fonts.pairingName, [config]);

  return (
    <li className="min-w-0">
      <Link
        to={`/${config.mode}/review?${CONFIG_PARAM}=${encodeConfig(config)}`}
        className="group flex h-full flex-col gap-4 rounded-card border border-line bg-surface p-4 transition-colors duration-150 hover:border-line-strong"
      >
        <TokenScope config={config} className="flex-1">
          <Demo projectType={config.projectType} />
        </TokenScope>
        <span className="block">
          <span className="flex items-center gap-2 font-display text-heading text-ink">
            {preset.name}
            <ArrowRight
              aria-hidden
              size={18}
              className="text-accent-ink transition-transform duration-150 group-hover:translate-x-1"
            />
          </span>
          <span className="mt-1 block text-muted">{preset.description}</span>
          <span className="mt-2 block font-mono text-label text-muted">{fonts}</span>
        </span>
      </Link>
    </li>
  );
}

export default function Examples() {
  return (
    <div className="mx-auto max-w-page px-4 py-10 md:px-8 md:py-16">
      <h1 className="m-0 font-display text-title font-normal text-ink">Example briefs</h1>
      <p className="mt-3 mb-0 max-w-reading text-muted">
        Twelve very different styles. Open one to see its full brief, then change anything you like
        and make it your own.
      </p>
      <ul className="mt-8 grid list-none gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
        {STYLE_PRESETS.map((preset) => (
          <ExampleCard key={preset.id} preset={preset} />
        ))}
      </ul>
    </div>
  );
}
