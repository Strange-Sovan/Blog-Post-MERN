import React from 'react';

interface TableSkeletonProps {
  headers: string[];
  rows?: number;
  tableClassName?: string;
  columnWidths?: string[];
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ headers, rows = 5, tableClassName = '', columnWidths }) => (
  <div className="overflow-x-auto" role="status" aria-label="Loading table">
    <span className="sr-only">Loading table...</span>
    <table className={`w-full text-sm ${tableClassName}`} aria-busy="true">
      {columnWidths && (
        <colgroup>
          {columnWidths.map((width, index) => <col key={index} style={{ width }} />)}
        </colgroup>
      )}
      <thead>
        <tr className="border-b border-border bg-muted/40">
          {headers.map((header, index) => (
            <th key={header} scope="col" className={`p-4 text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground ${index === headers.length - 1 ? 'text-center' : 'text-left'}`}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex} className="border-b border-border/60">
            {headers.map((header, columnIndex) => (
              <td key={header} className="p-4 align-middle">
                <div
                  className={`h-4 animate-pulse rounded bg-muted ${
                    ['w-3/4', 'w-2/3', 'w-4/5', 'w-1/2'][columnIndex % 4]
                  } ${columnIndex === headers.length - 1 ? 'mx-auto' : ''}`}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
