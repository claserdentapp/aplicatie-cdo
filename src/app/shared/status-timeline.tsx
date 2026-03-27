import { createClient } from "@/lib/supabase/server";

import StatusTimelineClient from "./status-timeline-client";

type HistoryRow = {
  id: string;
  order_id: string;
  actor_id: string | null;
  from_status: string | null;
  to_status: string;
  created_at: string;
};

export default async function StatusTimeline({
  orderId,
  mode,
}: {
  orderId: string;
  mode: "admin" | "medic";
}) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("order_status_history")
    .select("id,order_id,actor_id,from_status,to_status,created_at")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  const items = (data ?? []) as HistoryRow[];

  return <StatusTimelineClient orderId={orderId} mode={mode} initial={items} />;
}

