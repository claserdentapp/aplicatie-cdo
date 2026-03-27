"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

type HistoryRow = {
  id: string;
  order_id: string;
  actor_id: string | null;
  from_status: string | null;
  to_status: string;
  created_at: string;
};

function fmtDate(ts: string) {
  try {
    return new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ts));
  } catch {
    return ts;
  }
}

export default function StatusTimelineClient({
  orderId,
  mode,
  initial,
}: {
  orderId: string;
  mode: "admin" | "medic";
  initial: HistoryRow[];
}) {
  const [items, setItems] = useState<HistoryRow[]>(initial);

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [items],
  );

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`order-status:${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "order_status_history",
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const row = payload.new as HistoryRow;
          setItems((prev) => (prev.some((p) => p.id === row.id) ? prev : [...prev, row]));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status workflow</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length ? (
          <ol className="space-y-2">
            {sorted.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm">
                  {h.from_status ? <Badge variant="outline">{h.from_status}</Badge> : null}
                  <span className="text-muted-foreground">→</span>
                  <Badge variant="secondary">{h.to_status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {fmtDate(h.created_at)}
                  {mode === "admin" && h.actor_id ? ` • actor: ${h.actor_id}` : ""}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">Nu există istoric încă.</p>
        )}
      </CardContent>
    </Card>
  );
}

