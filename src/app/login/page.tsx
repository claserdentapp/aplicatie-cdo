import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

import LoginForm from "./ui/login-form";
import AccountChooser from "./ui/account-chooser";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const cStore = await cookies();
    const skipChooser = cStore.get("auto_continue")?.value;

    const { data: profile } = await supabase
      .from("profiles")
      .select("nume_doctor, rol")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.rol || "medic";
    const nextPath = role === "admin" ? "/admin" : role === "laborator_partener" ? "/laborator" : "/medic";

    if (skipChooser) {
      redirect(nextPath);
    } else {
      const displayName = profile?.nume_doctor || "Sunt";
      return (
        <AccountChooser
          name={displayName}
          email={user.email!}
          nextPath={nextPath}
        />
      );
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-md items-center px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Autentificare</CardTitle>
          <CardDescription>Accesează portalul laboratorului dentar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoginForm />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Nu ai cont?{" "}
              <Link className="text-foreground underline underline-offset-4" href="/register">
                Creează cont
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Ai uitat parola?{" "}
              <Link className="text-foreground underline underline-offset-4" href="/forgot-password">
                Recuperează aici
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

