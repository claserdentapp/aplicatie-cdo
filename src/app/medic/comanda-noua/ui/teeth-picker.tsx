"use client";

import { useMemo } from "react";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

// Minimal FDI picker (adult teeth), stored as string[].
const ADULT_FDI = [
  ["18", "17", "16", "15", "14", "13", "12", "11"],
  ["21", "22", "23", "24", "25", "26", "27", "28"],
  ["48", "47", "46", "45", "44", "43", "42", "41"],
  ["31", "32", "33", "34", "35", "36", "37", "38"],
];

export default function TeethPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const t = useTranslations("Order");
  const selected = useMemo(() => new Set(value), [value]);

  function toggle(tooth: string) {
    const next = new Set(selected);
    if (next.has(tooth)) next.delete(tooth);
    else next.add(tooth);
    onChange(Array.from(next).sort());
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {ADULT_FDI.map((row, idx) => (
          <div key={idx} className="grid grid-cols-8 gap-2">
            {row.map((tooth) => {
              const isOn = selected.has(tooth);
              return (
                <button
                  key={tooth}
                  type="button"
                  onClick={() => toggle(tooth)}
                  className={[
                    "h-10 rounded-md border text-sm font-medium transition-colors",
                    isOn
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted",
                  ].join(" ")}
                  aria-pressed={isOn}
                >
                  {tooth}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {value.length ? (
          value.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">{t("selectTeeth")}</p>
        )}
      </div>
    </div>
  );
}

