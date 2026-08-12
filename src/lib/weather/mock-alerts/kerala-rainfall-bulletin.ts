import type {
  AlertBulletin,
  AlertSeverity,
  DistrictForecastBoard,
  DistrictForecastRow,
  RainfallClass,
} from "../types";
import { KERALA_DISTRICTS } from "../locations/kerala-districts";

function isoDateOffset(days: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Sample pattern inspired by IMD/KSDMA district rainfall charts */
const DAY0: Record<string, { severity: AlertSeverity; rainfallClass: RainfallClass; label: string }> = {
  tvpm: { severity: "yellow", rainfallClass: "heavy", label: "ISOL H" },
  klm: { severity: "yellow", rainfallClass: "heavy", label: "ISOL H" },
  pta: { severity: "orange", rainfallClass: "very_heavy", label: "ISOL H to VH" },
  alp: { severity: "yellow", rainfallClass: "heavy", label: "ISOL H" },
  ktm: { severity: "orange", rainfallClass: "very_heavy", label: "ISOL H to VH" },
  ekm: { severity: "orange", rainfallClass: "very_heavy", label: "ISOL H to VH" },
  idk: { severity: "orange", rainfallClass: "very_heavy", label: "ISOL H to VH" },
  tsr: { severity: "yellow", rainfallClass: "heavy", label: "ISOL H" },
  pkd: { severity: "yellow", rainfallClass: "heavy", label: "ISOL H" },
  mlp: { severity: "orange", rainfallClass: "very_heavy", label: "ISOL H to VH" },
  koz: { severity: "red", rainfallClass: "extremely_heavy", label: "XH" },
  wyd: { severity: "red", rainfallClass: "extremely_heavy", label: "XH" },
  knr: { severity: "red", rainfallClass: "extremely_heavy", label: "XH" },
  ksgd: { severity: "red", rainfallClass: "extremely_heavy", label: "XH" },
};

function dayPattern(dayIndex: number, districtId: string) {
  if (dayIndex === 0) return DAY0[districtId] ?? { severity: "green" as const, rainfallClass: "moderate" as const, label: "L to M" };
  if (dayIndex === 1) {
    return { severity: "yellow" as const, rainfallClass: "heavy" as const, label: "ISOL H" };
  }
  return { severity: "green" as const, rainfallClass: "moderate" as const, label: "L to M" };
}

export function buildKeralaSampleBoard(): DistrictForecastBoard {
  const days = [0, 1, 2, 3, 4].map(isoDateOffset);
  const rows: DistrictForecastRow[] = KERALA_DISTRICTS.map((d) => ({
    districtId: d.id,
    districtName: d.name,
    days: days.map((date, i) => {
      const p = dayPattern(i, d.id);
      return {
        date,
        severity: p.severity,
        rainfallClass: p.rainfallClass,
        label: p.label,
      };
    }),
  }));

  return {
    state: "Kerala",
    issuedAt: new Date().toISOString(),
    days,
    rows,
    source: "ksdma-sample",
  };
}

export function buildKeralaSampleBulletin(): AlertBulletin {
  const board = buildKeralaSampleBoard();
  const day0 = board.days[0];

  const bySeverity = (sev: "red" | "orange" | "yellow") =>
    board.rows.filter((r) => r.days[0]?.severity === sev).map((r) => r.districtId);

  return {
    id: `kerala-sample-${day0}`,
    regionLabel: "Kerala",
    issuedAt: board.issuedAt,
    authorityLine: "IMD-KSEOC-KSDMA (sample bulletin for demo)",
    highestSeverity: "red",
    groups: [
      {
        severity: "red",
        date: day0,
        districtIds: bySeverity("red"),
        rainfallClass: "extremely_heavy",
        headline: "Red alert – extremely heavy rain likely",
      },
      {
        severity: "orange",
        date: day0,
        districtIds: bySeverity("orange"),
        rainfallClass: "very_heavy",
        headline: "Orange alert – heavy to very heavy rain likely",
      },
      {
        severity: "yellow",
        date: day0,
        districtIds: bySeverity("yellow"),
        rainfallClass: "heavy",
        headline: "Yellow alert – isolated heavy rain likely",
      },
    ],
    tips: [
      {
        id: "t1",
        text: "In hilly areas, move to safer ground in daylight if landslides are a risk.",
        priority: 1,
      },
      {
        id: "t2",
        text: "Do not enter rivers, streams, or flooded roads.",
        priority: 1,
      },
      {
        id: "t3",
        text: "Call 1077 for district control room help.",
        priority: 1,
        phoneHref: "tel:1077",
      },
      {
        id: "t4",
        text: "Avoid night travel in the hills while the red alert is active.",
        priority: 2,
      },
      {
        id: "t5",
        text: "Keep an emergency kit ready (torch, medicines, documents, water).",
        priority: 2,
      },
    ],
    board,
    sourceUrl: "https://sdma.kerala.gov.in/rainfall-2/",
    source: "ksdma-sample",
  };
}
