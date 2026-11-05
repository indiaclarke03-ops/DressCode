export function PaletteStrip({ label, colours }: { label: string; colours: string[] }) {
  return (
    <div>
      <p className="mt-0 mb-1.5 text-sm text-muted">{label}</p>
      <div className="flex overflow-hidden rounded-button border border-line">
        {colours.map((colour, index) => (
          <span
            key={`${colour}-${index}`}
            title={colour}
            className="h-10 min-w-0 flex-1"
            style={{ backgroundColor: colour }}
          />
        ))}
      </div>
    </div>
  );
}
