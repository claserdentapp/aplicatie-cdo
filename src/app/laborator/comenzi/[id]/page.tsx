import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

import OrderComments from "@/app/shared/order-comments";
import OrderFiles from "@/app/shared/order-files";
import StatusTimeline from "@/app/shared/status-timeline";

export default async function MedicComandaDetaliiPage({
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
    .select("id,created_at,nume_pacient,tip_lucrare,material,culoare_vita,status,urgenta,instructiuni,data_intrare,data_livrare_estimata,pret,doctor_id")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!order) notFound();

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
        <div className="flex items-center gap-3">
          <Link href="/laborator" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-semibold">Detalii comandă</h1>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">ID: {order.id}</p>
        </div>
        <div className="flex items-center gap-2">
          {order.urgenta ? <Badge variant="destructive">Urgență</Badge> : null}
          <Badge variant="secondary">{order.status}</Badge>
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
              <div className="text-muted-foreground mb-1 font-medium">Calendar Livrare</div>
              <div>
                <span className="text-muted-foreground">Intrare curentă:</span> {order.data_intrare}
              </div>
              <div>
                <span className="text-muted-foreground">Termen estimat:</span>{" "}
                <span className="font-medium text-foreground">{order.data_livrare_estimata ?? "Nespecificat"}</span>
              </div>
            </div>
            
            <div className="space-y-1 text-sm bg-muted/20 p-4 rounded-lg flex flex-col justify-center">
              <div className="text-muted-foreground mb-1 font-medium">Situație Financiară (RON)</div>
              <div>
                {order.pret !== null ? (
                  <span className="font-bold text-2xl text-primary">{order.pret} RON</span>
                ) : (
                  <span className="text-muted-foreground italic">Cost necalculat încă.</span>
                )}
              </div>
            </div>

            {order.instructiuni ? (
              <div className="md:col-span-2 space-y-1 mt-2">
                <div className="text-sm font-medium text-muted-foreground">Instrucțiuni Tehnice Trimise</div>
                <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted/10 p-4 text-sm font-sans leading-relaxed">
                  {order.instructiuni}
                </pre>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <StatusTimeline orderId={order.id} mode="medic" />

        <OrderFiles orderId={order.id} files={(files ?? []) as any[]} />

        <OrderComments orderId={order.id} currentUserId={user.id} initial={(comments ?? []) as any[]} />
      </div>
    </div>
  );
}
