import Link from "next/link";
import { UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import LanguageSwitcher from "./language-switcher";

export default async function Nav() {
  const supabase = await createClient();
  const locale = await getLocale();
  const t = await getTranslations("Nav");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-8">
          <Link href="/" className="font-bold tracking-tight text-primary">
            {process.env.NEXT_PUBLIC_LAB_NAME || "Dental Lab"}
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLoc={locale} />
            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
              {t("login")}
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("register")}
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Find out role to determine dashboard link
  const { data: profile } = await supabase
    .from("profiles")
    .select("rol, nume_doctor, nume_clinica")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.nume_clinica || profile?.nume_doctor || user.email;

  const role = profile?.rol ?? "medic";
  const dashLink = role === "admin" ? "/admin" : role === "laborator_partener" ? "/laborator" : "/medic";
  const profilLink = role === "admin" ? "/admin/profil" : role === "laborator_partener" ? "/laborator/profil" : "/medic/profil";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href={dashLink} className="font-bold tracking-tight text-primary">
            {process.env.NEXT_PUBLIC_LAB_NAME || "Dental Lab"}
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link href={dashLink} className="hover:text-foreground transition-colors">
              {t("dashboard")}
            </Link>
            {role === "admin" ? (
              <Link href="/admin/medici" className="hover:text-foreground transition-colors">
                {t("partners")}
              </Link>
            ) : null}
            {role === "medic" ? (
              <Link href="/medic/comanda-noua" className="hover:text-foreground transition-colors">
                {t("newOrder")}
              </Link>
            ) : null}
            {role === "laborator_partener" ? (
              <Link href="/laborator/comanda-noua" className="hover:text-foreground transition-colors">
                {t("newOrder")}
              </Link>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLoc={locale} />
          <span className="text-sm font-semibold text-foreground hidden lg:inline-block">
            {displayName}
          </span>
          <Link href={profilLink} className="text-muted-foreground hover:text-primary transition-colors">
            <UserCircle className="w-5 h-5" />
          </Link>
          <form action="/auth/signout" method="POST">
            <button
              className="text-sm font-medium text-muted-foreground hover:text-destructive hover:underline underline-offset-4 transition-colors ml-2"
            >
              {t("logout")}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
