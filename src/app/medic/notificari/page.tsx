import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

import NotificationsList from "./ui/notifications-list";

export default async function NotificariPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: items, error } = await supabase
    .from("notifications")
    .select("id,order_id,type,title,body,read_at,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    );
  }

  const unread = (items ?? []).filter((n) => !n.read_at).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Link href="/medic" className="text-muted-foreground hover:text-foreground transition-colors bg-muted/30 p-2 rounded-full hover:bg-muted/60">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Notificări</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Statusuri și actualizări de la laborator.</p>
          </div>
        </div>
        {unread ? <Badge variant="destructive">{unread} necitite</Badge> : <Badge variant="secondary">Totul citit</Badge>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Ultimele 100 notificări.</CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationsList initial={(items ?? []) as any[]} />
        </CardContent>
      </Card>
    </div>
  );
}

