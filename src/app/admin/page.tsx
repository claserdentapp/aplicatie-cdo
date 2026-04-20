import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

import AdminOrdersTable, { type AdminOrderRow } from "./ui/admin-orders-table";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const ts = await getTranslations("Admin");

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      "id,created_at,nume_pacient,tip_lucrare,material,culoare_vita,status,urgenta,pret,data_livrare_estimata,doctor_id,doctor:profiles(nume_doctor,nume_clinica)",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">{ts("dashboardTitle")}</h1>
      <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 pb-8 pt-8 px-6 lg:px-8">
          <CardTitle className="text-xl text-slate-800">{ts("ordersTitle")}</CardTitle>
          <CardDescription className="text-slate-500 font-medium text-[15px] mt-2">
            {ts("ordersDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 lg:p-8 bg-slate-50/50">
          {error ? (
            <p className="text-sm text-destructive font-semibold bg-red-50 p-4 rounded-xl border border-red-100">{error.message}</p>
          ) : (
            <AdminOrdersTable initial={(orders ?? []) as unknown as AdminOrderRow[]} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

