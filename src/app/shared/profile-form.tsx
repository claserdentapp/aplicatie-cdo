"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ProfileForm({
  initial,
}: {
  initial: {
    id: string;
    nume_doctor: string;
    nume_clinica: string | null;
    telefon: string | null;
    rol: string;
  };
}) {
  const [numeDoctor, setNumeDoctor] = useState(initial.nume_doctor || "");
  const [numeClinica, setNumeClinica] = useState(initial.nume_clinica || "");
  const [telefon, setTelefon] = useState(initial.telefon || "");

  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        nume_doctor: numeDoctor.trim(),
        nume_clinica: numeClinica.trim() || null,
        telefon: telefon.trim() || null,
      })
      .eq("id", initial.id);

    setSaving(false);
    if (error) {
      toast.error("Nu am putut actualiza profilul.", { description: error.message });
      return;
    }
    toast.success("Profil actualizat cu succes.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="numeDoctor">Nume complet / Titlu</Label>
        <Input
          id="numeDoctor"
          value={numeDoctor}
          onChange={(e) => setNumeDoctor(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">Ex: Dr. Popescu Ion</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numeClinica">Nume Clinică (Opțional pt Admin)</Label>
        <Input
          id="numeClinica"
          value={numeClinica}
          onChange={(e) => setNumeClinica(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefon">Telefon de Contact</Label>
        <Input
          id="telefon"
          type="tel"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={saving} className="gap-2">
        {saving ? "Se salvează..." : (
           <>
            <Save className="w-4 h-4" />
            Salvează Modificările
           </>
        )}
      </Button>
    </form>
  );
}
