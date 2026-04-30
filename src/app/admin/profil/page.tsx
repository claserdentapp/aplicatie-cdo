import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/app/shared/profile-form";

export default async function AdminProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors bg-muted/30 p-2 rounded-full hover:bg-muted/60">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold">Profil Laborator</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Date Administrator</CardTitle>
          <CardDescription>
            Gestionează informațiile vizibile echipei.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm initial={profile as any} />
        </CardContent>
      </Card>
    </div>
  );
}
