"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";

import DashboardAnalytics from "./dashboard-analytics";

import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type AdminOrderRow = {
  id: string;
  created_at: string;
  nume_pacient: string;
  tip_lucrare: string;
  material: string | null;
  culoare_vita: string | null;
  status: string;
  urgenta: boolean;
  pret: number | null;
  data_livrare_estimata: string | null;
  doctor_id: string;
  doctor: { nume_doctor: string; nume_clinica: string | null }[] | { nume_doctor: string; nume_clinica: string | null } | null;
};

const STATUS_OPTIONS = ["nou", "design", "frezare", "sinterizare", "glazura", "finalizat", "livrat", "anulat"] as const;

export default function AdminOrdersTable({ initial }: { initial: AdminOrderRow[] }) {
  const ts = useTranslations("Admin");
  const [rows, setRows] = useState<AdminOrderRow[]>(initial);

  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState("in_lucru"); // "toate", "in_lucru", "gata"
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [urgenta, setUrgenta] = useState<"all" | "yes" | "no">("all");
  const [facturare, setFacturare] = useState<string | null>(null);

  const doctors = useMemo(() => {
    const map = new Map<string, { id: string; label: string }>();
    for (const r of rows) {
      const doc = Array.isArray(r.doctor) ? r.doctor[0] : r.doctor;
      const label = doc
        ? `${doc.nume_doctor}${doc.nume_clinica ? ` — ${doc.nume_clinica}` : ""}`
        : r.doctor_id;
      map.set(r.doctor_id, { id: r.doctor_id, label });
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [rows]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      // Filtrare rapidă pe tab
      if (activeTab === "in_lucru") {
        if (["finalizat", "livrat", "anulat"].includes(r.status)) return false;
      } else if (activeTab === "gata") {
        if (!["finalizat", "livrat"].includes(r.status)) return false;
      }

      const doc = Array.isArray(r.doctor) ? r.doctor[0] : r.doctor;

      if (doctorId && r.doctor_id !== doctorId) return false;
      if (status && r.status !== status) return false;
      if (urgenta === "yes" && !r.urgenta) return false;
      if (urgenta === "no" && r.urgenta) return false;
      if (facturare === "facturat" && (r.pret === null || r.pret === undefined)) return false;
      if (facturare === "nefacturat" && r.pret !== null && r.pret !== undefined) return false;
      if (!needle) return true;
      const hay = [
        r.nume_pacient,
        r.tip_lucrare,
        r.culoare_vita ?? "",
        r.status,
        doc?.nume_doctor ?? "",
        doc?.nume_clinica ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [rows, q, activeTab, doctorId, status, urgenta, facturare]);

  useEffect(() => {
    const supabase = createClient();

    async function refetchOne(id: string) {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id,created_at,nume_pacient,tip_lucrare,material,culoare_vita,status,urgenta,pret,data_livrare_estimata,doctor_id,doctor:profiles(nume_doctor,nume_clinica)",
        )
        .eq("id", id)
        .maybeSingle();
      if (!error && data) {
        const row = data as unknown as AdminOrderRow;
        setRows((prev) => {
          const exists = prev.some((p) => p.id === row.id);
          return exists ? prev.map((p) => (p.id === row.id ? row : p)) : [row, ...prev];
        });
      }
    }

    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
        const id = (payload.new as any)?.id as string | undefined;
        if (id) {
          refetchOne(id).catch(() => {});
          try {
            toast.custom((toastId) => (
              <div className="flex flex-col gap-2 p-5 bg-indigo-600 text-white rounded-2xl shadow-2xl border-4 border-indigo-400 w-[340px] animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2.5 rounded-full text-xl animate-pulse">🔔</div>
                  <h3 className="text-xl font-black uppercase tracking-wide">Comandă Nouă!</h3>
                </div>
                <p className="text-indigo-100 font-medium text-base mt-1">O nouă comandă a fost plasată în sistem. Pagina s-a actualizat automat.</p>
                <button onClick={() => toast.dismiss(toastId)} className="mt-3 bg-white text-indigo-700 font-bold py-2.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm">Închide notificarea</button>
              </div>
            ), { duration: 15000, position: "top-center" });
            
            // Play a loud synthetic beep
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (ctx.state === "suspended") {
              ctx.resume().catch(() => {}); 
            }
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            
            osc1.frequency.value = 880; // A5
            osc2.frequency.value = 885; // Slight detune for thicker sound
            osc1.type = "square";
            osc2.type = "square";
            
            // Envelope for a loud, piercing 2-second alert
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.8, ctx.currentTime + 0.5);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
            
            osc1.start(ctx.currentTime);
            osc2.start(ctx.currentTime);
            osc1.stop(ctx.currentTime + 1.5);
            osc2.stop(ctx.currentTime + 1.5);
          } catch (err) {
            console.warn("Audio Context playback failed: ", err);
          }
        }
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, (payload) => {
        const id = (payload.new as any)?.id as string | undefined;
        if (id) refetchOne(id).catch(() => {});
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "orders" }, (payload) => {
        const id = (payload.old as any)?.id as string | undefined;
        if (id) setRows((prev) => prev.filter((p) => p.id !== id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function updateOrder(id: string, patch: Partial<Pick<AdminOrderRow, "status">>) {
    const supabase = createClient();

    // optimistic UI
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) {
      toast.error("Nu am putut salva modificarea.", { description: error.message });
      // revert by reloading from server
      const { data, error: refetchErr } = await supabase
        .from("orders")
        .select(
          "id,created_at,nume_pacient,tip_lucrare,material,culoare_vita,status,urgenta,pret,data_livrare_estimata,doctor_id,doctor:profiles(nume_doctor,nume_clinica)",
        )
        .order("created_at", { ascending: false })
        .limit(200);
      if (!refetchErr && data) setRows(data as AdminOrderRow[]);
      return;
    }

    toast.success("Salvat.");
  }

  return (
    <div className="space-y-8">
      <DashboardAnalytics orders={rows} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-col sm:grid sm:grid-cols-3 w-full max-w-[600px] h-auto sm:h-12 bg-slate-100/50 p-1.5 sm:p-1 gap-1 sm:gap-0 rounded-xl">
          <TabsTrigger value="in_lucru" className="w-full text-[14px] md:text-[15px] font-semibold data-[state=active]:shadow-sm rounded-lg py-2.5 sm:py-1">{ts("tabInProgress")}</TabsTrigger>
          <TabsTrigger value="gata" className="w-full text-[14px] md:text-[15px] font-semibold data-[state=active]:shadow-sm rounded-lg py-2.5 sm:py-1">{ts("tabDone")}</TabsTrigger>
          <TabsTrigger value="toate" className="w-full text-[14px] md:text-[15px] font-semibold data-[state=active]:shadow-sm rounded-lg py-2.5 sm:py-1">{ts("tabAll")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-5 md:grid-cols-4 lg:grid-cols-5 p-6 rounded-2xl border border-slate-200/60 bg-white shadow-sm">
        <div className="md:col-span-2 lg:col-span-2 space-y-1.5">
          <Label htmlFor="q" className="text-slate-500 font-semibold uppercase tracking-wider text-xs">{ts("searchLabel")}</Label>
          <Input
            id="q"
            className="h-11"
            placeholder={ts("searchPlaceholder")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-500 font-semibold uppercase tracking-wider text-xs">{ts("doctorLabel")}</Label>
          <Select value={doctorId} onValueChange={(v) => setDoctorId(v)}>
            <SelectTrigger className="w-full h-11">
              <SelectValue placeholder={ts("all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={""}>{ts("all")}</SelectItem>
              {doctors.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-500 font-semibold uppercase tracking-wider text-xs">{ts("statusLabel")}</Label>
          <Select value={status} onValueChange={(v) => setStatus(v)}>
            <SelectTrigger className="w-full h-11">
              <SelectValue placeholder={ts("all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={""}>{ts("all")}</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-500 font-semibold uppercase tracking-wider text-xs">{ts("billingLabel")}</Label>
          <Select value={facturare} onValueChange={(v) => setFacturare(v)}>
            <SelectTrigger className="w-full h-11">
              <SelectValue placeholder={ts("all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={""}>{ts("all")}</SelectItem>
              <SelectItem value="facturat">{ts("billed")}</SelectItem>
              <SelectItem value="nefacturat">{ts("unbilled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-1">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{ts("urgentLabel")}</span>
        <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200">
          <button
            type="button"
            className={[
              "rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
              urgenta === "all" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
            onClick={() => setUrgenta("all")}
          >
            {ts("all")}
          </button>
          <button
            type="button"
            className={[
              "rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
              urgenta === "yes" ? "bg-red-500 text-white shadow-sm" : "text-slate-500 hover:text-red-600",
            ].join(" ")}
            onClick={() => setUrgenta("yes")}
          >
            {ts("yes")}
          </button>
          <button
            type="button"
            className={[
              "rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
              urgenta === "no" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
            onClick={() => setUrgenta("no")}
          >
            {ts("no")}
          </button>
        </div>
        <span className="ml-auto text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {ts("resultsCount", { count: filtered.length })}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-slate-600 py-4 px-5">{ts("thDoctor")}</TableHead>
              <TableHead className="font-semibold text-slate-600">{ts("thPatient")}</TableHead>
              <TableHead className="font-semibold text-slate-600">{ts("thWork")}</TableHead>
              <TableHead className="font-semibold text-slate-600">{ts("thStatus")}</TableHead>
              <TableHead className="font-semibold text-slate-600">{ts("thPrice")}</TableHead>
              <TableHead className="font-semibold text-slate-600">{ts("thUrgent")}</TableHead>
              <TableHead className="font-semibold text-slate-600">{ts("thDelivery")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => {
              const doc = Array.isArray(r.doctor) ? r.doctor[0] : r.doctor;
              return (
              <TableRow key={r.id} className="group hover:bg-slate-50/70 transition-colors">
                <TableCell className="max-w-[260px] py-4 px-5 align-top">
                  <div className="truncate font-semibold text-slate-900 text-[15px]">
                    {doc?.nume_doctor ?? r.doctor_id}
                  </div>
                  <div className="truncate text-[13px] font-medium text-slate-500 mt-0.5">
                    {doc?.nume_clinica ?? ""}
                  </div>
                </TableCell>
                <TableCell className="font-bold text-[15px] align-top py-4">
                  <Link className="text-indigo-600 hover:text-indigo-800 transition-colors hover:underline underline-offset-4" href={`/admin/comenzi/${r.id}`}>
                    {r.nume_pacient}
                  </Link>
                </TableCell>
                <TableCell className="align-top py-4">
                  <div className="font-semibold text-slate-800 text-[15px]">{r.tip_lucrare}</div>
                  <div className="text-[13px] font-medium text-slate-500 mt-0.5">
                    {r.culoare_vita ? <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{r.culoare_vita}</span> : ""}
                  </div>
                </TableCell>
                <TableCell className="align-top py-4">
                  <Select
                    value={r.status ?? null}
                    onValueChange={(v) => updateOrder(r.id, { status: v ?? "nou" })}
                  >
                    <SelectTrigger className={`w-[180px] h-9 font-semibold ${r.status === 'finalizat' || r.status === 'livrat' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50'}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s} className="font-medium">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="align-top py-4">
                  {r.pret !== null && r.pret !== undefined ? (
                    <span className="font-bold text-[15px] text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block">{r.pret} RON</span>
                  ) : (
                    <span className="text-slate-400 font-medium text-[13px] bg-slate-50 px-2 py-1 rounded border border-dashed border-slate-200 inline-block">{ts("unbilledText")}</span>
                  )}
                </TableCell>
                <TableCell className="align-top py-4">
                  {r.urgenta ? <Badge variant="destructive" className="font-bold tracking-wide">!! {ts("yes")}</Badge> : <span className="text-slate-400 font-medium text-[14px]">{ts("no")}</span>}
                </TableCell>
                <TableCell className="align-top py-4">
                  <span className="text-[15px] font-medium text-slate-700">{r.data_livrare_estimata ?? "-"}</span>
                </TableCell>
              </TableRow>
              );
            })}
            {!filtered.length ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center text-[15px] font-medium text-slate-400">
                  {ts("noOrdersFound")}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

