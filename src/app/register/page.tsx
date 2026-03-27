import { redirect } from "next/navigation";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

import RegisterForm from "./ui/register-form";

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/medic");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-md items-center px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Creare cont</CardTitle>
          <CardDescription>Cont nou pentru medic (clinică).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RegisterForm />
          <p className="text-sm text-muted-foreground">
            Ai deja cont?{" "}
            <Link className="text-foreground underline underline-offset-4" href="/login">
              Autentificare
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

