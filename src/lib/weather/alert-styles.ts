import type { AlertSeverity } from "@/lib/weather/types";

export const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  white: "No rain",
  green: "No action needed",
  yellow: "Watch – stay updated",
  orange: "Alert – be prepared",
  red: "Warning – take action",
};

export const SEVERITY_SHORT: Record<AlertSeverity, string> = {
  white: "White",
  green: "Green",
  yellow: "Yellow",
  orange: "Orange",
  red: "Red",
};

export function severityClasses(severity: AlertSeverity): string {
  switch (severity) {
    case "red":
      return "bg-red-600 text-white border-red-700";
    case "orange":
      return "bg-orange-500 text-zinc-950 border-orange-600";
    case "yellow":
      return "bg-yellow-300 text-zinc-950 border-yellow-500";
    case "green":
      return "bg-emerald-500 text-white border-emerald-600";
    case "white":
    default:
      return "bg-zinc-100 text-zinc-800 border-zinc-300";
  }
}

export function severityDot(severity: AlertSeverity): string {
  switch (severity) {
    case "red":
      return "bg-red-600";
    case "orange":
      return "bg-orange-500";
    case "yellow":
      return "bg-yellow-400";
    case "green":
      return "bg-emerald-500";
    default:
      return "bg-zinc-200";
  }
}

export const RAINFALL_BANDS = [
  { name: "Light", range: "2.5 – 15.5 mm" },
  { name: "Moderate", range: "15.6 – 64.4 mm" },
  { name: "Heavy", range: "64.5 – 115.5 mm" },
  { name: "Very heavy", range: "115.6 – 204.4 mm" },
  { name: "Extremely heavy", range: "> 204.4 mm" },
] as const;
