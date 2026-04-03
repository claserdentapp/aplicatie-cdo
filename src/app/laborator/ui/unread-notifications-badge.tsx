"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

export default function UnreadNotificationsBadge({
  initialCount,
}: {
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const supabase = createClient();

    async function recompute() {
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .is("read_at", null);
      setCount(count ?? 0);
    }

    recompute().catch(() => {});

    const channel = supabase
      .channel("notifications:badge")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, () => {
        recompute().catch(() => {});
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "notifications" }, () => {
        recompute().catch(() => {});
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return count ? <Badge variant="destructive">{count}</Badge> : null;
}

