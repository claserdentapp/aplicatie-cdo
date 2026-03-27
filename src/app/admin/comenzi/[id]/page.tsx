import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CopyPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

import OrderComments from "@/app/shared/order-comments";
import OrderFiles from "@/app/shared/order-files";
import StatusTimeline from "@/app/shared/status-timeline";
import StatusEditor from "./ui/status-editor";
import PriceEditor from "./ui/price-editor";

export default async function AdminComandaDetaliiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id,created_at,nume_pacient,tip_lucrare,material,culoare_vita,status,urgenta,instructiuni,data_intrare,data_livrare_estimata,pret,doctor_id,doctor:profiles(nume_doctor,nume_clinica,telefon)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!order) notFound();

  const doctor = (order as any).doctor?.[0] ?? null;

  const { data: files } = await supabase
    .from("order_files")
    .select("id,file_path,file_url,file_type,created_at")
    .eq("order_id", id)
    .order("created_at", { ascending: false });

  const { data: comments } = await supabase
    .from("comments")
    .select("id,order_id,user_id,text,created_at")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Detalii comandă</h1>
          <p className="text-sm text-muted-foreground">ID: {order.id}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Link href={`/admin/comenzi/${order.id}/aviz`}>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <CopyPlus className="w-4 h-4" />
              Vizualizare Aviz / Tipărire
            </Button>
          </Link>
          <StatusEditor orderId={order.id} currentStatus={order.status} urgent={order.urgenta} />
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{order.nume_pacient}</CardTitle>
            <CardDescription>
              {order.tip_lucrare}
              {order.material ? ` • ${order.material}` : ""}
              {order.culoare_vita ? ` • ${order.culoare_vita}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1 text-sm bg-muted/40 p-4 rounded-lg">
              <div className="text-muted-foreground mb-1 font-medium">Doctor / Clinică</div>
              <div className="font-semibold text-foreground">{doctor?.nume_doctor ?? order.doctor_id}</div>
              <div className="text-muted-foreground">{doctor?.nume_clinica ?? "-"}</div>
              <div className="text-muted-foreground">{doctor?.telefon ?? ""}</div>
            </div>
            
            <div className="space-y-1 text-sm bg-muted/20 p-4 rounded-lg flex flex-col justify-between">
              <div>
                <div className="text-muted-foreground mb-1 font-medium">Calendar Livrare</div>
                <div>
                  <span className="text-muted-foreground">Intrare:</span> {order.data_intrare}
                </div>
                <div>
                  <span className="text-muted-foreground">Termen estimat:</span>{" "}
                  {order.data_livrare_estimata ?? "-"}
                </div>
              </div>
              <PriceEditor orderId={order.id} currentPrice={order.pret} />
            </div>

            {order.instructiuni ? (
              <div className="md:col-span-2 space-y-1 mt-2">
                <div className="text-sm font-medium text-muted-foreground">Instrucțiuni Tehnice</div>
                <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted/10 p-4 text-sm font-sans leading-relaxed">
                  {order.instructiuni}
                </pre>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <StatusTimeline orderId={order.id} mode="admin" />

        <OrderFiles orderId={order.id} files={(files ?? []) as any[]} />

        <OrderComments orderId={order.id} currentUserId={user.id} initial={(comments ?? []) as any[]} />
      </div>
    </div>
  );
}
