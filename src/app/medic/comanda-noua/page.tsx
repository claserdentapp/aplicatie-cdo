import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

import NewOrderForm from "./ui/new-order-form";

export default async function ComandaNouaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Comandă nouă</CardTitle>
          <CardDescription>
            Completează detaliile cazului și încarcă fișierele (STL/OBJ/fotografii).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewOrderForm />
        </CardContent>
      </Card>
    </div>
  );
}

