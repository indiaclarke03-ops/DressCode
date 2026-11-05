export type TableStyle = 'lines-between-rows' | 'striped-rows' | 'minimal';
export type TableDensity = 'compact' | 'comfortable';

interface DataTableProps {
  columns: string[];
  rows: string[][];
  /** Columns from this index on hold numbers and align right. */
  numericFrom?: number;
  variant?: TableStyle;
  density?: TableDensity;
}

const CELL_PADDING: Record<TableDensity, string> = {
  compact: 'py-0.5',
  comfortable: 'py-bb-2',
};

export function DataTable({
  columns,
  rows,
  numericFrom = 1,
  variant = 'lines-between-rows',
  density = 'comfortable',
}: DataTableProps) {
  const align = (index: number) =>
    index >= numericFrom ? 'text-right font-bb-mono tabular-nums' : 'text-left';
  const rowLine = variant === 'lines-between-rows' ? 'border-t border-bb-border' : '';

  return (
    <table className="w-full border-collapse text-bb-1" data-table={`${variant} ${density}`}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={column}
              className={`pb-bb-1 font-medium text-bb-muted ${index >= numericFrom ? 'text-right' : 'text-left'}`}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr
            key={row[0]}
            className={`${rowLine} ${variant === 'striped-rows' && rowIndex % 2 === 0 ? 'bg-bb-background' : ''}`}
          >
            {row.map((cell, index) => (
              <td
                key={`${row[0]}-${index}`}
                className={`${CELL_PADDING[density]} px-0 text-bb-text ${align(index)}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
