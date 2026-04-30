"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function RegisterForm() {
  const router = useRouter();
  const t = useTranslations("Auth");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [numeDoctor, setNumeDoctor] = useState("");
  const [numeClinica, setNumeClinica] = useState("");
  const [cui, setCui] = useState("");
  const [telefon, setTelefon] = useState("");
  const [rol, setRol] = useState<"medic" | "laborator_partener">("medic");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nume_doctor: numeDoctor,
          nume_clinica: numeClinica,
          telefon,
          cui,
          rol,
        },
      },
    });

    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess(t("successReg"));
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="rol">{t("accountType")}</Label>
        <select
          id="rol"
          value={rol}
          onChange={(e) => setRol(e.target.value as any)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="medic">{t("medic")}</option>
          <option value="laborator_partener">{t("lab")}</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numeDoctor">
          {rol === "medic" ? t("doctorName") : t("repName")}
        </Label>
        <Input
          id="numeDoctor"
          value={numeDoctor}
          onChange={(e) => setNumeDoctor(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="numeClinica">
          {rol === "medic" ? t("clinicName") : t("labName")}
        </Label>
        <Input
          id="numeClinica"
          value={numeClinica}
          onChange={(e) => setNumeClinica(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cui">
          {rol === "medic" ? (t("cuiMedic") || "CUI Cabinet") : (t("cuiLab") || "CUI Laborator")}
        </Label>
        <Input
          id="cui"
          value={cui}
          onChange={(e) => setCui(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="telefon">{t("phone")}</Label>
        <Input id="telefon" value={telefon} onChange={(e) => setTelefon(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p> : null}
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? t("creating") : t("createBtn")}
      </Button>
    </form>
  );
}

