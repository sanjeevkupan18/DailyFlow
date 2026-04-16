import { heatmapLevel } from '../../utils/scoreHelpers';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function HeatmapCalendar({ data = [], year }) {
  const [tooltip, setTooltip] = useState(null);

  // Build week-indexed grid
  const byDate = {};
  data.forEach((d) => { byDate[d.date] = d; });

  // Create 53 columns x 7 rows grid
  const startDate = new Date(year, 0, 1);
  const startDay = startDate.getDay(); // 0=Sun
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);

  const daysInYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
  for (let i = 0; i < daysInYear; i++) {
    const d = new Date(year, 0, i + 1);
    const dateStr = format(d, 'yyyy-MM-dd');
    cells.push({ date: dateStr, ...(byDate[dateStr] || { value: 0, score: 0 }) });
  }

  // Pad to multiple of 7
  while (cells.length % 7 !== 0) cells.push(null);

  // Group into weeks (columns)
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const cellSize = 12;
  const gap = 2;

  return (
    <div className="card overflow-x-auto">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">{year} Activity Heatmap</h3>

      {/* Month labels */}
      <div className="flex mb-1" style={{ marginLeft: 20 }}>
        {MONTHS.map((m, i) => {
          const weekOfMonth = Math.floor(new Date(year, i, 1).getTime() / (7 * 24 * 60 * 60 * 1000));
          return <span key={m} className="text-xs text-slate-400 dark:text-slate-400" style={{ flex: i < 11 ? '1' : 'auto' }}>{m}</span>;
        })}
      </div>

      <div className="flex gap-0.5">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} className="text-xs text-slate-300 dark:text-slate-600 leading-none" style={{ height: cellSize, lineHeight: `${cellSize}px` }}>{i % 2 === 1 ? d : ''}</div>
          ))}
        </div>

        {/* Cells */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((cell, di) => {
              if (!cell) return <div key={di} style={{ width: cellSize, height: cellSize }} />;
              const level = heatmapLevel(cell.value);
              return (
                <div
                  key={di}
                  className={`heatmap-${level} heatmap-cell`}
                  style={{ width: cellSize, height: cellSize }}
                  title={`${cell.date}: ${cell.value}% complete`}
                  onMouseEnter={() => setTooltip(cell)}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-slate-400 dark:text-slate-400">Less</span>
        {[0,1,2,3,4].map((l) => (
          <div key={l} className={`heatmap-${l} w-3 h-3 rounded-sm`} />
        ))}
        <span className="text-xs text-slate-400 dark:text-slate-400">More</span>
      </div>
    </div>
  );
}
