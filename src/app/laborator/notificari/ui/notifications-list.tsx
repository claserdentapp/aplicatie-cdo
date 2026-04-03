"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type NotificationRow = {
  id: string;
  order_id: string | null;
  type: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
};

function fmtDate(ts: string) {
  try {
    return new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ts));
  } catch {
    return ts;
  }
}

export default function NotificationsList({ initial }: { initial: NotificationRow[] }) {
  const [items, setItems] = useState<NotificationRow[]>(initial);
  const unreadCount = useMemo(() => items.filter((i) => !i.read_at).length, [items]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("notifications:inbox")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        const row = payload.new as NotificationRow;
        setItems((prev) => (prev.some((p) => p.id === row.id) ? prev : [row, ...prev]));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "notifications" }, (payload) => {
        const row = payload.new as NotificationRow;
        setItems((prev) => prev.map((p) => (p.id === row.id ? row : p)));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function markAllRead() {
    const supabase = createClient();
    const now = new Date().toISOString();
    const ids = items.filter((i) => !i.read_at).map((i) => i.id);
    if (!ids.length) return;

    setItems((prev) => prev.map((i) => (!i.read_at ? { ...i, read_at: now } : i)));
    const { error } = await supabase.from("notifications").update({ read_at: now }).in("id", ids);
    if (error) {
      toast.error("Nu am putut marca notificările.", { description: error.message });
    }
  }

  async function markOneRead(id: string) {
    const supabase = createClient();
    const now = new Date().toISOString();
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read_at: now } : i)));
    const { error } = await supabase.from("notifications").update({ read_at: now }).eq("id", id);
    if (error) toast.error("Nu am putut marca notificarea.", { description: error.message });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          {unreadCount ? `${unreadCount} necitite` : "Nu ai notificări necitite."}
        </div>
        <Button type="button" variant="outline" onClick={markAllRead} disabled={!unreadCount}>
          Marchează tot citit
        </Button>
      </div>

      {items.length ? (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-medium">{n.title}</div>
                    {!n.read_at ? <Badge variant="destructive">Nou</Badge> : <Badge variant="secondary">Citit</Badge>}
                  </div>
                  {n.body ? <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{n.body}</p> : null}
                  <div className="mt-2 text-xs text-muted-foreground">{fmtDate(n.created_at)}</div>
                </div>
                <div className="flex items-center gap-2">
                  {n.order_id ? (
                    <Link className="text-sm underline underline-offset-4" href={`/medic/comenzi/${n.order_id}`}>
                      Deschide comanda
                    </Link>
                  ) : null}
                  {!n.read_at ? (
                    <button
                      type="button"
                      className="text-sm underline underline-offset-4"
                      onClick={() => markOneRead(n.id)}
                    >
                      Marchează citit
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Nu există notificări.</p>
      )}
    </div>
  );
}

