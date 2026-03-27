"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";

const STATUS_OPTIONS = ["nou", "design", "frezare", "sinterizare", "glazura", "finalizat", "livrat", "anulat"] as const;

export default function StatusEditor({
  orderId,
  currentStatus,
  urgent,
}: {
  orderId: string;
  currentStatus: string;
  urgent: boolean;
}) {
  const [status, setStatus] = useState<string>(currentStatus);
  const [saving, setSaving] = useState(false);

  async function save(next: string | null) {
    if (!next) return;
    if (next === status) return;
    setSaving(true);
    setStatus(next);
    const supabase = createClient();
    const { error } = await supabase.from("orders").update({ status: next }).eq("id", orderId);
    setSaving(false);
    if (error) {
      toast.error("Nu am putut schimba statusul.", { description: error.message });
      setStatus(currentStatus);
      return;
    }
    toast.success("Status actualizat.");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {urgent ? <Badge variant="destructive">Urgență</Badge> : null}
      <Select value={status ?? null} onValueChange={(v) => save(v)}>
        <SelectTrigger className="w-[200px]" disabled={saving}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

