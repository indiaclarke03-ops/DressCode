import { PagePlaceholder } from './PagePlaceholder';

export default function Tweaks() {
  return (
    <div className="mx-auto max-w-page px-4 py-10 md:px-8 md:py-16">
      <h1 className="m-0 font-display text-title font-normal text-ink">Quick tweaks</h1>
      <p className="mt-3 mb-0 max-w-reading text-muted">One change, one short and precise prompt.</p>
      <PagePlaceholder phase={7} />
    </div>
  );
}
