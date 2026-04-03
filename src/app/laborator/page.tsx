import { redirect } from "next/navigation";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import UnreadNotificationsBadge from "./ui/unread-notifications-badge";
import MedicOrdersTable, { type MedicOrderRow } from "./ui/medic-orders-table";

export default async function MedicDashboard() {
  const supabase = await createClient();
  const t = await getTranslations("Dashboard");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .is("read_at", null);

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id,nume_pacient,tip_lucrare,material,culoare_vita,status,urgenta,pret,created_at,data_livrare_estimata")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t("labTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("labDesc")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link className="text-sm underline underline-offset-4" href="/laborator/notificari">
            {t("notifications")} <UnreadNotificationsBadge initialCount={unreadCount ?? 0} />
          </Link>
          <Link
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            href="/laborator/comanda-noua"
          >
            {t("newOrderBtn")}
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("recentOrders")}</CardTitle>
          <CardDescription>{t("limit50")}</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">{error.message}</p>
          ) : orders?.length ? (
            <MedicOrdersTable currentUserId={user.id} initial={(orders ?? []) as unknown as MedicOrderRow[]} />
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("noOrders")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

