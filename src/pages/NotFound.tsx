import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-page px-4 py-16 md:px-8 md:py-24">
      <h1 className="m-0 font-display text-title font-normal text-ink">This page isn't here</h1>
      <p className="mt-3 mb-6 text-muted">The link may be out of date.</p>
      <Button asChild>
        <Link to="/">Back to the start</Link>
      </Button>
    </div>
  );
}
