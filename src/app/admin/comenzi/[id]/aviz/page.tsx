import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import PrintButton from "@/app/shared/print-button";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id,created_at,nume_pacient,tip_lucrare,material,culoare_vita,status,urgenta,data_intrare,pret,doctor_id,doctor:profiles(nume_doctor,nume_clinica,telefon)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !order) notFound();

  // Verify role (admin only can print official invoice for now, though medics could too)
  const { data: profile } = await supabase
    .from("profiles")
    .select("rol")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.rol !== "admin") {
    redirect("/medic");
  }

  const doctor = (order as any).doctor?.[0] ?? null;
  const today = new Intl.DateTimeFormat("ro-RO", { dateStyle: "long" }).format(new Date());
  const pretVal = order.pret ?? 0;

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      <div className="max-w-4xl mx-auto border sm:shadow-lg p-10 bg-white">
        {/* Print controls (hidden in print) */}
        <div className="mb-8 flex justify-end print:hidden">
          <PrintButton />
        </div>

        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AVIZ DE ÎNSOȚIRE</h1>
            <p className="text-sm text-gray-500 mt-1">Nr. referință: {order.id.split('-')[0].toUpperCase()}</p>
            <p className="text-sm text-gray-500">Dată emiterii: {today}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">{process.env.NEXT_PUBLIC_LAB_NAME || "ClaSerDent Technology Lab"}</h2>
            <p className="text-sm text-gray-600">Strada Exemplu, Nr. 10</p>
            <p className="text-sm text-gray-600">CIF: RO12345678</p>
            <p className="text-sm text-gray-600">contact@cdolab.ro</p>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-10">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Beneficiar</h3>
          <div className="text-gray-800">
            <p className="font-semibold text-lg">{doctor?.nume_clinica || "Clinică Parteneră"}</p>
            <p>Medic: {doctor?.nume_doctor ?? order.doctor_id}</p>
            <p>Telefon: {doctor?.telefon ?? "-"}</p>
          </div>
        </div>

        {/* Order Info */}
        <div className="mb-10 w-full overflow-hidden border rounded-lg border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Pacient</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Tip Lucrare</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Material & Culoare</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Dată Preluare</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Preț (RON)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-4 font-medium text-gray-900">{order.nume_pacient}</td>
                <td className="px-4 py-4 text-gray-700">
                   {order.tip_lucrare} 
                   {order.urgenta ? <span className="text-red-600 font-bold ml-1">(Urgență)</span> : ""}
                </td>
                <td className="px-4 py-4 text-gray-700">
                   {order.material || "-"} {order.culoare_vita ? ` / ${order.culoare_vita}` : ""}
                </td>
                <td className="px-4 py-4 text-gray-700">{order.data_intrare}</td>
                <td className="px-4 py-4 text-right font-medium text-gray-900">
                   {pretVal ? pretVal.toFixed(2) : "-"}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50 border-t">
              <tr>
                <td colSpan={4} className="px-4 py-4 text-right font-bold text-gray-900">Total de plată:</td>
                <td className="px-4 py-4 text-right font-bold text-gray-900 text-lg">
                  {pretVal ? `${pretVal.toFixed(2)} RON` : "Nefacturat"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t text-sm text-gray-500 text-center">
          <p>Acest aviz ține loc de bon de plată / livrare pentru lucrarea protetică. Document emis generat automat prin portalul digital {process.env.NEXT_PUBLIC_LAB_NAME || "ClaSerDent Technology Lab"}.</p>
        </div>
      </div>
    </div>
  );
}
