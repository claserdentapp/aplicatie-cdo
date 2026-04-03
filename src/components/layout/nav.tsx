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
        <div className="container mx-auto flex flex-wrap gap-y-4 py-3 min-h-[4rem] md:h-20 items-center justify-between px-4 sm:px-8">
          <Link href="/" className="text-lg md:text-xl font-bold tracking-tight text-primary flex items-center gap-2 md:gap-3">
            <img src="/logo.png" alt="Logo" className="h-8 md:h-12 w-auto object-contain" />
            <span className="hidden sm:inline">{process.env.NEXT_PUBLIC_LAB_NAME || "ClaSerDent Technology Lab"}</span>
            <span className="sm:hidden">ClaSerDent</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-6">
            <LanguageSwitcher currentLoc={locale} />
            <Link href="/login" className="text-sm md:text-lg font-medium hover:underline underline-offset-4 px-2 md:px-4 py-2">
              {t("login")}
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 md:h-12 items-center justify-center rounded-md bg-primary px-3 md:px-8 text-sm md:text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-sm hover:scale-105"
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
      <div className="container mx-auto flex flex-wrap gap-y-4 py-3 min-h-[4rem] md:h-20 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4 md:gap-8 flex-1">
          <Link href={dashLink} className="text-lg md:text-xl font-bold tracking-tight text-primary flex items-center gap-2 md:gap-3">
            <img src="/logo.png" alt="Logo" className="h-8 md:h-12 w-auto object-contain" />
            <span className="hidden sm:inline">{process.env.NEXT_PUBLIC_LAB_NAME || "ClaSerDent Technology Lab"}</span>
            <span className="sm:hidden">ClaSerDent</span>
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

        <div className="flex items-center gap-3 md:gap-6">
          <LanguageSwitcher currentLoc={locale} />
          <span className="text-sm md:text-base font-semibold text-foreground hidden sm:inline-block">
            {displayName}
          </span>
          <Link href={profilLink} className="text-muted-foreground hover:text-primary transition-colors">
            <UserCircle className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <form action="/auth/signout" method="POST">
            <button
              className="text-sm md:text-base font-medium text-muted-foreground hover:text-destructive hover:underline underline-offset-4 transition-colors ml-1 md:ml-2"
            >
              {t("logout")}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
