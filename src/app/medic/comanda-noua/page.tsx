import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

import NewOrderForm from "./ui/new-order-form";

export default async function ComandaNouaPage() {
  const supabase = await createClient();
  const tNav = await getTranslations("Nav");
  const tOrder = await getTranslations("Order");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link href="/medic" className="text-muted-foreground hover:text-foreground transition-colors mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            {tNav("newOrder")}
          </CardTitle>
          <CardDescription>
            {tOrder("descNewOrder")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewOrderForm />
        </CardContent>
      </Card>
    </div>
  );
}

