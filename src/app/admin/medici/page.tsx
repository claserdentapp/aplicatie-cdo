import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import MedicsTable, { MedicProfileRow } from "./ui/medics-table";

export default async function AdminMediciPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Only admins can reach this route due to middleware.
  const { data: medics, error } = await supabase
    .from("profiles")
    .select("id,nume_doctor,nume_clinica,telefon,created_at")
    .eq("rol", "medic")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Director Parteneri</h1>
        <p className="text-sm text-muted-foreground">Medicii și clinicile care au cont creat în portalul tău.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agendă Clienți</CardTitle>
          <CardDescription>
            Lista completă a doctorilor afiliați laboratorului tău și datele lor de contact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">{error.message}</p>
          ) : (
            <MedicsTable initial={(medics ?? []) as MedicProfileRow[]} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
