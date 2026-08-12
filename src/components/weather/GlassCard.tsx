import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "div";
  "aria-label"?: string;
  style?: CSSProperties;
};

/** Shared glass panel with one radius and sky-tinted surface. */
export function GlassCard({
  children,
  className = "",
  as: Tag = "section",
  "aria-label": ariaLabel,
  style,
}: Props) {
  return (
    <Tag
      aria-label={ariaLabel}
      style={style}
      className={`weather-panel ${className}`}
    >
      {children}
    </Tag>
  );
}

export function PanelTitle({
  children,
  trailing,
}: {
  children: ReactNode;
  icon?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="min-w-0 truncate text-[15px] font-semibold tracking-tight text-white">
        {children}
      </h2>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
