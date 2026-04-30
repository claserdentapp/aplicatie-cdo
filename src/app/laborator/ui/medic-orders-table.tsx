"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type MedicOrderRow = {
  id: string;
  nume_pacient: string;
  tip_lucrare: string;
  material: string | null;
  culoare_vita: string | null;
  status: string;
  urgenta: boolean;
  pret: number | null;
  created_at: string;
  data_livrare_estimata: string | null;
};

export default function MedicOrdersTable({
  currentUserId,
  initial,
}: {
  currentUserId: string;
  initial: MedicOrderRow[];
}) {
  const [rows, setRows] = useState<MedicOrderRow[]>(initial);
  const t = useTranslations("Dashboard");
  const [activeTab, setActiveTab] = useState("in_lucru"); // "toate", "in_lucru", "gata"

  const sorted = useMemo(() => {
    let filtered = rows;
    if (activeTab === "in_lucru") {
      filtered = rows.filter((r) => !["finalizat", "livrat", "anulat"].includes(r.status));
    } else if (activeTab === "gata") {
      filtered = rows.filter((r) => ["finalizat", "livrat", "anulat"].includes(r.status));
    }
    return [...filtered].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 50);
  }, [rows, activeTab]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`medic-orders:${currentUserId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders", filter: `doctor_id=eq.${currentUserId}` },
        (payload) => {
          const row = payload.new as any as MedicOrderRow;
          setRows((prev) => (prev.some((p) => p.id === row.id) ? prev : [row, ...prev]));
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `doctor_id=eq.${currentUserId}` },
        (payload) => {
          const row = payload.new as any as MedicOrderRow;
          setRows((prev) => prev.map((p) => (p.id === row.id ? { ...p, ...row } : p)));
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "orders", filter: `doctor_id=eq.${currentUserId}` },
        (payload) => {
          const oldRow = payload.old as any as { id: string };
          setRows((prev) => prev.filter((p) => p.id !== oldRow.id));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="in_lucru">{t("tabInProgress")}</TabsTrigger>
          <TabsTrigger value="gata">{t("tabDone")}</TabsTrigger>
          <TabsTrigger value="toate">{t("tabAll")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="overflow-x-auto">
        <Table className="text-base md:text-lg">
        <TableHeader>
          <TableRow className="text-sm md:text-base">
            <TableHead>{t("thPatient")}</TableHead>
            <TableHead>{t("thWork")}</TableHead>
            <TableHead>{t("thMaterial")}</TableHead>
            <TableHead>{t("thStatus")}</TableHead>
            <TableHead>{t("thCost")}</TableHead>
            <TableHead>{t("thUrgent")}</TableHead>
            <TableHead>{t("thDelivery")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((o) => (
            <TableRow key={o.id} className="h-16 md:h-20 hover:bg-muted/50 transition-colors">
              <TableCell className="font-semibold text-primary">
                <Link className="hover:underline underline-offset-4 block py-2" href={`/laborator/comenzi/${o.id}`}>
                  {o.nume_pacient}
                </Link>
              </TableCell>
              <TableCell className="font-medium">{o.tip_lucrare}</TableCell>
              <TableCell>{o.material ?? "-"}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-sm md:text-base px-3 py-1">{o.status}</Badge>
              </TableCell>
              <TableCell>
                {o.pret !== null && o.pret !== undefined ? (
                  <span className="font-bold">{o.pret} RON</span>
                ) : (
                  <span className="text-muted-foreground italic text-sm">-</span>
                )}
              </TableCell>
              <TableCell>{o.urgenta ? <Badge variant="destructive" className="text-sm px-3 py-1">{t("yes")}</Badge> : t("no")}</TableCell>
              <TableCell className="whitespace-nowrap">{o.data_livrare_estimata ?? "-"}</TableCell>
            </TableRow>
          ))}
          {!sorted.length ? (
            <TableRow>
              <TableCell colSpan={7} className="py-12 text-center text-lg text-muted-foreground">
                {t("noOrders")}
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}


