import { redirect } from "next/navigation";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

import LoginForm from "./ui/login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/medic");

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

