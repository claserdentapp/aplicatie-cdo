import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

import LoginForm from "./ui/login-form";
import AccountChooser from "./ui/account-chooser";

export default async function LoginPage() {
  const supabase = await createClient();
  const t = await getTranslations("Auth");
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
    <div className="mx-auto flex flex-col min-h-[calc(100vh-2rem)] max-w-md justify-center px-4 py-8">
      <div className="mb-8 flex justify-center w-full">
        {/*
          Imaginea brandului pentru pagina de login.
          Recomandare: format .png sau .webp cu fundal transparent.
          Clientul trebuie sa puna imaginea cu acest nume in folderul /public.
        */}
        <img src="/logo.png" alt="Brand Logo" className="max-h-40 w-auto object-contain drop-shadow-md" />
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("titleLogin")}</CardTitle>
          <CardDescription>{t("descLogin")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoginForm />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {t("noAccount")}{" "}
              <Link className="text-foreground underline underline-offset-4" href="/register">
                {t("registerLink")}
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              {t("forgotPasswordQ")}{" "}
              <Link className="text-foreground underline underline-offset-4" href="/forgot-password">
                {t("forgotPasswordLink")}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

