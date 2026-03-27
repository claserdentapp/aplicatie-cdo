"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Phone, Building2, UserCircle2 } from "lucide-react";

export type MedicProfileRow = {
  id: string;
  nume_doctor: string;
  nume_clinica: string | null;
  telefon: string | null;
  created_at: string;
};

export default function MedicsTable({ initial }: { initial: MedicProfileRow[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return initial;
    return initial.filter((r) => {
      const hay = [r.nume_doctor, r.nume_clinica ?? "", r.telefon ?? ""].join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [initial, q]);

  if (!initial.length) {
    return <p className="text-sm text-muted-foreground">Niciun medic nu și-a creat cont până acum.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="max-w-md">
        <Label htmlFor="q">Căutare partener</Label>
        <Input
          id="q"
          placeholder="Nume medic, clinică, număr telefon..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Clinică</TableHead>
              <TableHead>Contact (Telefon)</TableHead>
              <TableHead>Data Înregistrării</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => {
              const dateObj = new Date(r.created_at);
              const formattedDate = dateObj.toLocaleDateString("ro-RO", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                       <UserCircle2 className="w-4 h-4 text-muted-foreground" />
                       <span>{r.nume_doctor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                       <Building2 className="w-4 h-4 text-muted-foreground" />
                       <span>{r.nume_clinica ?? "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {r.telefon ? (
                      <div className="flex items-center gap-2 text-primary">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${r.telefon}`} className="hover:underline">
                          {r.telefon}
                        </a>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">Necompletat</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formattedDate}</TableCell>
                </TableRow>
              );
            })}
            {!filtered.length ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                  Niciun rezultat pentru căutarea introdusă.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
