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
        r.material ?? "",
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
            toast.info("Comandă nouă primită!", { duration: 8000, position: "top-center" });
            
            // Play a synthetic beep (Web Audio API) instead of relying on an external file
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (ctx.state === "suspended") {
              ctx.resume().catch(() => {}); // Try resuming, browser might block if no interaction occurred
            }
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.value = 600; // Frequency in Hz
            osc.type = "sine";
            // Envelope
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
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
    <div className="space-y-6">
      <DashboardAnalytics orders={rows} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="in_lucru">În Lucru (De procesat)</TabsTrigger>
          <TabsTrigger value="gata">Gata (Finalizate / Livrate)</TabsTrigger>
          <TabsTrigger value="toate">Istoric Complet</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-5">
        <div className="md:col-span-2 lg:col-span-2">
          <Label htmlFor="q">Căutare</Label>
          <Input
            id="q"
            placeholder="pacient, lucrare, material, doctor..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div>
          <Label>Doctor</Label>
          <Select value={doctorId} onValueChange={(v) => setDoctorId(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Toți" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={""}>Toți</SelectItem>
              {doctors.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Toate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={""}>Toate</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Facturare</Label>
          <Select value={facturare} onValueChange={(v) => setFacturare(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Toate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={""}>Toate</SelectItem>
              <SelectItem value="facturat">Facturate</SelectItem>
              <SelectItem value="nefacturat">Nefacturate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Urgență:</span>
        <button
          type="button"
          className={[
            "rounded-md border px-2 py-1 text-sm",
            urgenta === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted",
          ].join(" ")}
          onClick={() => setUrgenta("all")}
        >
          Toate
        </button>
        <button
          type="button"
          className={[
            "rounded-md border px-2 py-1 text-sm",
            urgenta === "yes" ? "border-destructive bg-destructive text-destructive-foreground" : "border-border hover:bg-muted",
          ].join(" ")}
          onClick={() => setUrgenta("yes")}
        >
          Da
        </button>
        <button
          type="button"
          className={[
            "rounded-md border px-2 py-1 text-sm",
            urgenta === "no" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted",
          ].join(" ")}
          onClick={() => setUrgenta("no")}
        >
          Nu
        </button>
        <span className="ml-auto text-sm text-muted-foreground">{filtered.length} rezultate</span>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Pacient</TableHead>
              <TableHead>Lucrare</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Preț</TableHead>
              <TableHead>Urgență</TableHead>
              <TableHead>Livrare</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => {
              const doc = Array.isArray(r.doctor) ? r.doctor[0] : r.doctor;
              return (
              <TableRow key={r.id}>
                <TableCell className="max-w-[260px]">
                  <div className="truncate font-medium">
                    {doc?.nume_doctor ?? r.doctor_id}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {doc?.nume_clinica ?? ""}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <Link className="underline underline-offset-4" href={`/admin/comenzi/${r.id}`}>
                    {r.nume_pacient}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{r.tip_lucrare}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.material ?? "-"} {r.culoare_vita ? `• ${r.culoare_vita}` : ""}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={r.status ?? null}
                    onValueChange={(v) => updateOrder(r.id, { status: v ?? "nou" })}
                  >
                    <SelectTrigger className="w-[180px]">
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
                </TableCell>
                <TableCell>
                  {r.pret !== null && r.pret !== undefined ? (
                    <span className="font-semibold text-primary">{r.pret} RON</span>
                  ) : (
                    <span className="text-muted-foreground italic text-xs">Nefacturat</span>
                  )}
                </TableCell>
                <TableCell>{r.urgenta ? <Badge variant="destructive">Da</Badge> : "Nu"}</TableCell>
                <TableCell>{r.data_livrare_estimata ?? "-"}</TableCell>
              </TableRow>
            ))}
            {!filtered.length ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  Nicio comandă găsită.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

