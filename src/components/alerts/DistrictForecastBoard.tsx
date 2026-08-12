import type { DistrictForecastBoard } from "@/lib/weather/types";
import {
  RAINFALL_BANDS,
  SEVERITY_SHORT,
  severityClasses,
  severityDot,
} from "@/lib/weather/alert-styles";
import { formatIstDate } from "@/lib/format/units";

type Props = {
  board: DistrictForecastBoard;
  locationId: string;
};

export function DistrictForecastBoardView({ board, locationId }: Props) {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
      <h2 className="text-lg font-semibold">5-day district rainfall alerts</h2>
      <p className="mt-1 text-sm text-zinc-300">
        Same meaning as the IMD colour chart – easier to scan. Sample board for demo.
      </p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {board.days.map((day, dayIndex) => {
          const counts = { red: 0, orange: 0, yellow: 0, green: 0, white: 0 };
          for (const row of board.rows) {
            const s = row.days[dayIndex]?.severity ?? "green";
            counts[s] += 1;
          }
          return (
            <div
              key={day}
              className="min-w-[7.5rem] shrink-0 rounded-xl border border-white/15 bg-zinc-950/40 p-3"
            >
              <p className="text-xs font-medium text-zinc-300">{formatIstDate(day)}</p>
              <ul className="mt-2 space-y-1 text-xs">
                {(["red", "orange", "yellow", "green"] as const).map((s) =>
                  counts[s] ? (
                    <li key={s} className="flex items-center gap-1.5">
                      <span className={`size-2.5 rounded-full ${severityDot(s)}`} aria-hidden />
                      {counts[s]} {SEVERITY_SHORT[s]}
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-zinc-950/60">
              <th scope="col" className="sticky left-0 z-10 bg-zinc-950/95 px-3 py-2 font-semibold">
                District
              </th>
              {board.days.map((day) => (
                <th key={day} scope="col" className="px-2 py-2 font-semibold whitespace-nowrap">
                  {formatIstDate(day)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {board.rows.map((row) => {
              const isMine = row.districtId === locationId;
              return (
                <tr
                  key={row.districtId}
                  className={isMine ? "bg-sky-500/20" : "odd:bg-white/5"}
                >
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 px-3 py-2 font-medium ${
                      isMine ? "bg-sky-950/95 text-sky-100" : "bg-zinc-950/95"
                    }`}
                  >
                    {row.districtName}
                    {isMine ? (
                      <span className="ml-1 text-xs font-normal text-sky-300">(you)</span>
                    ) : null}
                  </th>
                  {row.days.map((cell) => (
                    <td key={cell.date} className="px-2 py-1.5">
                      <span
                        className={`inline-flex min-h-9 min-w-[4.5rem] items-center justify-center rounded-lg border px-2 text-xs font-semibold ${severityClasses(cell.severity)}`}
                        title={`${SEVERITY_SHORT[cell.severity]}: ${cell.label}`}
                      >
                        <span className="sr-only">{SEVERITY_SHORT[cell.severity]} – </span>
                        {cell.label}
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-sky-200">
          Rainfall meaning (mm in 24 hours)
        </summary>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {RAINFALL_BANDS.map((b) => (
            <li
              key={b.name}
              className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm"
            >
              <span className="font-semibold">{b.name}</span>
              <span className="mt-0.5 block text-zinc-300">{b.range}</span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
