"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function AccountChooser({
  name,
  email,
  nextPath,
}: {
  name: string;
  email: string;
  nextPath: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Auth");

  async function handleContinue() {
    setLoading(true);
    Cookies.set("auto_continue", "true", { expires: 365, path: "/" });
    router.push(nextPath);
    router.refresh();
  }

  async function handleSwitch() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    Cookies.remove("auto_continue");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-md items-center px-4 py-8">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <UserCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>{t("welcomeBack")}</CardTitle>
          <CardDescription className="text-lg font-medium text-foreground">
            {name}
          </CardDescription>
          <p className="text-sm text-muted-foreground">{email}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleContinue} className="w-full" disabled={loading}>
            {loading ? t("loggingIn") : `${t("continueAs")} ${name}`}
          </Button>
          <Button onClick={handleSwitch} variant="outline" className="w-full" disabled={loading}>
            {t("switchAccount")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
