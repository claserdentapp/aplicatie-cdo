"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

import TeethPicker from "./teeth-picker";

const BUCKET = "order-files";

type UploadItem = {
  file: File;
  type: "stl" | "obj" | "photo" | "other";
};

function classifyFile(file: File): UploadItem["type"] {
  const name = file.name.toLowerCase();
  if (name.endsWith(".stl")) return "stl";
  if (name.endsWith(".obj")) return "obj";
  if (file.type.startsWith("image/")) return "photo";
  return "other";
}

export default function NewOrderForm() {
  const router = useRouter();

  const [numePacient, setNumePacient] = useState("");
  const [tipLucrare, setTipLucrare] = useState("");
  const [material, setMaterial] = useState<string | undefined>(undefined);
  const [culoareVita, setCuloareVita] = useState("");
  const [urgenta, setUrgenta] = useState(false);
  const [instructiuni, setInstructiuni] = useState("");
  const [dataLivrareEstimata, setDataLivrareEstimata] = useState<string>("");
  const [dinti, setDinti] = useState<string[]>([]);

  const [files, setFiles] = useState<UploadItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const filesSummary = useMemo(() => {
    const counts = { stl: 0, obj: 0, photo: 0, other: 0 } as Record<UploadItem["type"], number>;
    files.forEach((f) => (counts[f.type] += 1));
    return counts;
  }, [files]);

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const incoming = Array.from(list).map((file) => ({ file, type: classifyFile(file) as UploadItem["type"] }));
    setFiles((prev) => [...prev, ...incoming]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!numePacient.trim() || !tipLucrare.trim()) {
      toast.error("Completează numele pacientului și tipul lucrării.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!user) throw new Error("Neautentificat");

      const instructiuniFinale =
        (dinti.length ? `Dinți (FDI): ${dinti.join(", ")}\n\n` : "") + (instructiuni ?? "");

      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          doctor_id: user.id,
          nume_pacient: numePacient.trim(),
          tip_lucrare: tipLucrare.trim(),
          material: material ?? null,
          culoare_vita: culoareVita.trim() || null,
          urgenta,
          instructiuni: instructiuniFinale.trim() || null,
          data_livrare_estimata: dataLivrareEstimata || null,
          status: "nou",
        })
        .select("id")
        .single();
      if (orderErr) throw orderErr;

      const orderId = order.id as string;

      if (files.length) {
        toast.message("Se încarcă fișierele...", { description: `${files.length} fișiere` });
      }

      for (const item of files) {
        const path = `${orderId}/${crypto.randomUUID()}-${item.file.name}`;
        const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(path, item.file, {
          upsert: false,
          contentType: item.file.type || undefined,
        });
        if (uploadErr) throw uploadErr;

        // Bucket is private; we store the storage path and generate signed URLs later when listing.
        const { error: fileRowErr } = await supabase.from("order_files").insert({
          order_id: orderId,
          file_url: path,
          file_path: path,
          file_type: item.type,
        });
        if (fileRowErr) throw fileRowErr;
      }

      toast.success("Comandă trimisă cu succes.");
      router.replace("/medic");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Eroare necunoscută";
      toast.error("Nu am putut trimite comanda.", { description: message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="numePacient">Nume pacient</Label>
          <Input
            id="numePacient"
            value={numePacient}
            onChange={(e) => setNumePacient(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipLucrare">Tip lucrare</Label>
          <Input
            id="tipLucrare"
            placeholder="Ex: Coroană, fațetă, punte, inlay/onlay..."
            value={tipLucrare}
            onChange={(e) => setTipLucrare(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Material</Label>
          <Select
            value={material ?? null}
            onValueChange={(v) => setMaterial(v ?? undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selectează material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Zirconiu">Zirconiu</SelectItem>
              <SelectItem value="Emax">Emax</SelectItem>
              <SelectItem value="Metal-Ceramică">Metal-Ceramică</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="culoareVita">Culoare VITA</Label>
          <Input
            id="culoareVita"
            placeholder="Ex: A1, A2, B1..."
            value={culoareVita}
            onChange={(e) => setCuloareVita(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dataLivrare">Data livrare estimată</Label>
          <Input
            id="dataLivrare"
            type="date"
            value={dataLivrareEstimata}
            onChange={(e) => setDataLivrareEstimata(e.target.value)}
          />
        </div>
        <div className="flex items-end gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={urgenta}
              onChange={(e) => setUrgenta(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Urgență
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Diagramă dentară (FDI)</Label>
        <TeethPicker value={dinti} onChange={setDinti} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructiuni">Instrucțiuni specifice</Label>
        <Textarea
          id="instructiuni"
          placeholder="Margini, contact proximal, ocluzie, cimentare, preferințe..."
          value={instructiuni}
          onChange={(e) => setInstructiuni(e.target.value)}
          rows={6}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <Label>Fișiere (STL/OBJ/fotografii)</Label>
          <p className="text-xs text-muted-foreground">
            STL: {filesSummary.stl}, OBJ: {filesSummary.obj}, Poze: {filesSummary.photo}, Altele:{" "}
            {filesSummary.other}
          </p>
        </div>

        <div
          className="rounded-lg border border-dashed border-border bg-muted/30 p-6"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Trage fișiere aici sau selectează din calculator.
            </p>
            <Input
              type="file"
              multiple
              accept=".stl,.obj,image/*"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>
          {files.length ? (
            <ul className="mt-4 space-y-1 text-sm">
              {files.map((f, idx) => (
                <li key={`${f.file.name}-${idx}`} className="flex items-center justify-between gap-3">
                  <span className="truncate">
                    {f.file.name} <span className="text-muted-foreground">({f.type})</span>
                  </span>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    elimină
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Se trimite..." : "Trimite comanda"}
        </Button>
      </div>
    </form>
  );
}

