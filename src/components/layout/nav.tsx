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
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
            {process.env.NEXT_PUBLIC_LAB_NAME || "ClaSerDent Technology Lab"}
          </Link>
          <div className="flex items-center gap-6">
            <LanguageSwitcher currentLoc={locale} />
            <Link href="/login" className="text-lg font-medium hover:underline underline-offset-4 px-4 py-2">
              {t("login")}
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-sm hover:scale-105"
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
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href={dashLink} className="text-xl font-bold tracking-tight text-primary flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
            {process.env.NEXT_PUBLIC_LAB_NAME || "ClaSerDent Technology Lab"}
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-base font-medium text-muted-foreground">
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

        <div className="flex items-center gap-6">
          <LanguageSwitcher currentLoc={locale} />
          <span className="text-base font-semibold text-foreground hidden lg:inline-block">
            {displayName}
          </span>
          <Link href={profilLink} className="text-muted-foreground hover:text-primary transition-colors">
            <UserCircle className="w-6 h-6" />
          </Link>
          <form action="/auth/signout" method="POST">
            <button
              className="text-base font-medium text-muted-foreground hover:text-destructive hover:underline underline-offset-4 transition-colors ml-2"
            >
              {t("logout")}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
