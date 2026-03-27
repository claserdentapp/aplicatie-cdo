"use client";

import { useMemo } from "react";
import { Activity, CircleDollarSign, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminOrderRow } from "./admin-orders-table";

export default function DashboardAnalytics({ orders }: { orders: AdminOrderRow[] }) {
  const analytics = useMemo(() => {
    let active = 0;
    let revenue = 0;
    let urgencies = 0;

    for (const order of orders) {
      // Considered active if not in a final state
      if (!["livrat", "finalizat", "anulat"].includes(order.status)) {
        active++;
      }

      // Revenue sum
      if (order.pret !== null && order.pret !== undefined) {
        // Only count revenue for things that are not completely cancelled
        if (order.status !== "anulat") {
           revenue += Number(order.pret);
        }
      }

      // Urgency
      if (order.urgenta && !["livrat", "anulat"].includes(order.status)) {
        urgencies++;
      }
    }

    return { active, revenue, urgencies };
  }, [orders]);

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balanță Generată (Total)</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.revenue.toFixed(2)} RON</div>
          <p className="text-xs text-muted-foreground pt-1">
            Din {orders.filter(o => o.pret !== null && o.status !== "anulat").length} comenzi evaluate.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comenzi în Lucru</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.active}</div>
          <p className="text-xs text-muted-foreground pt-1">
            Lucrări care așteaptă livrarea / finalizarea.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Urgențe Nerezolvate</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.urgencies}</div>
          <p className="text-xs text-muted-foreground pt-1">
            Care necesită focus imediat.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
