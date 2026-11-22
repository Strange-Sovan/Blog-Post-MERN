import React from 'react';

interface TableSkeletonProps {
  headers: string[];
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ headers, rows = 5 }) => (
  <div className="overflow-x-auto" role="status" aria-label="Loading table">
    <span className="sr-only">Loading table...</span>
    <table className="w-full min-w-[42rem] text-sm" aria-busy="true">
      <thead>
        <tr className="border-b border-slate-100 bg-slate-50/80">
          {headers.map((header) => (
            <th key={header} scope="col" className="p-4 text-left text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex} className="border-b border-slate-50">
            {headers.map((header, columnIndex) => (
              <td key={header} className="p-4">
                <div
                  className={`h-4 animate-pulse rounded bg-gradient-to-r from-slate-100 to-indigo-50 ${
                    ['w-3/4', 'w-2/3', 'w-4/5', 'w-1/2'][columnIndex % 4]
                  }`}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
