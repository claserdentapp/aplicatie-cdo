"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type CommentRow = {
  id: string;
  order_id: string;
  user_id: string;
  text: string;
  created_at: string;
};

function fmtDate(ts: string) {
  try {
    return new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ts));
  } catch {
    return ts;
  }
}

export default function OrderComments({
  orderId,
  currentUserId,
  initial,
}: {
  orderId: string;
  currentUserId: string;
  initial: CommentRow[];
}) {
  const [items, setItems] = useState<CommentRow[]>(initial);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const sorted = useMemo(() => [...items].sort((a, b) => a.created_at.localeCompare(b.created_at)), [items]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`order-comments:${orderId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `order_id=eq.${orderId}` },
        (payload) => {
          const row = payload.new as CommentRow;
          setItems((prev) => (prev.some((p) => p.id === row.id) ? prev : [...prev, row]));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  async function refresh() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("comments")
      .select("id,order_id,user_id,text,created_at")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });
    if (!error && data) setItems(data as CommentRow[]);
  }

  async function send() {
    const value = text.trim();
    if (!value) return;
    setSending(true);
    const supabase = createClient();

    const { error } = await supabase.from("comments").insert({
      order_id: orderId,
      user_id: currentUserId,
      text: value,
    });

    setSending(false);
    if (error) {
      toast.error("Nu am putut trimite mesajul.", { description: error.message });
      return;
    }

    setText("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comentarii</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-[360px] space-y-2 overflow-auto rounded-lg border bg-muted/10 p-3">
          {sorted.length ? (
            sorted.map((c) => (
              <div key={c.id} className="rounded-md border bg-background p-3">
                <div className="mb-1 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>{c.user_id === currentUserId ? "Tu" : "Participant"}</span>
                  <span>{fmtDate(c.created_at)}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm">{c.text}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Nu există comentarii încă.</p>
          )}
        </div>

        <div className="space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Scrie un mesaj..."
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="button" onClick={send} disabled={sending}>
              {sending ? "Se trimite..." : "Trimite"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

