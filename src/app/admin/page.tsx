import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

import AdminOrdersTable, { type AdminOrderRow } from "./ui/admin-orders-table";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      "id,created_at,nume_pacient,tip_lucrare,material,culoare_vita,status,urgenta,pret,data_livrare_estimata,doctor_id,doctor:profiles(nume_doctor,nume_clinica)",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Dashboard Laborator</h1>
      <Card>
        <CardHeader>
          <CardTitle>Comenzi</CardTitle>
          <CardDescription>
            Tabel centralizat cu filtre. Poți schimba statusul și seta prețul.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">{error.message}</p>
          ) : (
            <AdminOrdersTable initial={(orders ?? []) as unknown as AdminOrderRow[]} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

