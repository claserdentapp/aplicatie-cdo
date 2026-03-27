import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/app/shared/profile-form";

export default async function MedicProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nume_doctor, nume_clinica, telefon, rol")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Setări Profil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Date Personale</CardTitle>
          <CardDescription>
            Gestionează datele de contact și asocierile clinicii.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm initial={profile as any} />
        </CardContent>
      </Card>
    </div>
  );
}
