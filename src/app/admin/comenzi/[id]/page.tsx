import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CopyPlus, ChevronLeft, Briefcase, ActivitySquare, BadgeAlert, FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

import OrderComments from "@/app/shared/order-comments";
import OrderFiles from "@/app/shared/order-files";
import StatusTimeline from "@/app/shared/status-timeline";
import StatusEditor from "./ui/status-editor";
import PriceEditor from "./ui/price-editor";

export default async function AdminComandaDetaliiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ts = await getTranslations("Admin");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id,created_at,nume_pacient,tip_lucrare,material,culoare_vita,status,urgenta,instructiuni,data_intrare,data_livrare_estimata,pret,doctor_id,doctor:profiles(nume_doctor,nume_clinica,telefon)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!order) notFound();

  const doctor = Array.isArray((order as any).doctor) ? (order as any).doctor[0] : (order as any).doctor;

  const { data: files } = await supabase
    .from("order_files")
    .select("id,file_path,file_url,file_type,created_at")
    .eq("order_id", id)
    .order("created_at", { ascending: false });

  const { data: comments } = await supabase
    .from("comments")
    .select("id,order_id,user_id,text,created_at")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto max-w-[1400px] px-4 xl:px-8 py-8 md:py-12 bg-[#f8fafc] min-h-screen">
      
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center text-[14px] font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-6 group bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
          <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
          {ts("backToOrders")}
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 tracking-tight">{ts("orderDetailsTitle")}</h1>
            <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest bg-slate-200/50 inline-block px-2 py-0.5 rounded">ID: {order.id}</p>
          </div>
          <div className="flex gap-3 items-center">
            <Link href={`/admin/comenzi/${order.id}/aviz`}>
              <Button variant="outline" size="sm" className="h-10 px-4 font-semibold gap-2 border-slate-300 shadow-sm hover:bg-slate-50">
                <CopyPlus className="w-[18px] h-[18px] text-indigo-600" />
                {ts("viewTicket")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* L E F T   C O L U M N   (INFO & MEDIA) */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          
          <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden rounded-2xl">
            <CardHeader className="bg-white border-b border-slate-100 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex justify-center items-center">
                   <Briefcase className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900">{order.nume_pacient}</CardTitle>
                  <CardDescription className="text-base text-slate-500 font-medium mt-1">
                    {order.tip_lucrare}
                    {order.material ? ` • ${order.material}` : ""}
                    {order.culoare_vita ? <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">{order.culoare_vita}</span> : ""}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 p-6 md:p-8 bg-slate-50/50">
              
              <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-600">
                  <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center border border-blue-100">
                     <FileText className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="text-[13px] font-bold tracking-widest uppercase">{ts("doctorOrClinic")}</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">{doctor?.nume_doctor ?? order.doctor_id}</div>
                  <div className="text-[15px] font-semibold text-slate-600">{doctor?.nume_clinica ?? "-"}</div>
                  <div className="text-[14px] font-medium text-slate-400 mt-1">{doctor?.telefon ?? "Fără telefon"}</div>
                </div>
              </div>
              
              <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-[13px] font-bold text-slate-600 mb-4 tracking-widest uppercase">{ts("deliveryCalendar")}</div>
                  <div className="grid gap-2 border-l-2 border-indigo-200 pl-4">
                    <div className="text-[15px] font-semibold flex items-center justify-between">
                      <span className="text-slate-400">{ts("entryDate")}</span> <span className="text-slate-700">{order.data_intrare}</span>
                    </div>
                    <div className="text-[15px] font-semibold flex items-center justify-between">
                      <span className="text-slate-400">{ts("estDeadline")}</span> <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{order.data_livrare_estimata ?? "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {order.instructiuni ? (
                <div className="md:col-span-2 mt-4">
                  <div className="text-[13px] font-bold text-slate-600 mb-3 tracking-widest uppercase">{ts("techInstructions")}</div>
                  <pre className="whitespace-pre-wrap rounded-xl border border-amber-200/60 bg-[#fffbeb] p-6 text-[15px] text-slate-800 font-sans leading-relaxed shadow-sm">
                    {order.instructiuni}
                  </pre>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Timeline - Design imbunatatit nativ */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8">
             <div className="flex items-center gap-2 mb-6">
                <ActivitySquare className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">{ts("workflowStatus", { fallback: "Evoluție Culoar" })}</h2>
             </div>
             <StatusTimeline orderId={order.id} mode="admin" />
          </div>

          {/* Fisiere si Comentarii - le potrivim direct sub Timeline */}
          <OrderFiles orderId={order.id} files={(files ?? []) as any[]} />
          <OrderComments orderId={order.id} currentUserId={user.id} initial={(comments ?? []) as any[]} />

        </div>

        {/* R I G H T   C O L U M N   (ACTION CENTER - STICKY) */}
        <div className="xl:col-span-4 relative">
           <div className="sticky top-10 flex flex-col gap-6">
              
              {/* ACTION: URGENTA */}
              {order.urgenta && (
                <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex gap-4 items-start shadow-sm animate-in zoom-in duration-500">
                  <BadgeAlert className="w-8 h-8 text-red-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-red-800 text-lg">Caz de Urgență</h3>
                    <p className="text-red-600/80 font-medium text-sm mt-1 leading-relaxed">Această comandă are grad de prioritate maximă. Te rugăm să respecți deadline-ul sau să avizezi clinica.</p>
                  </div>
                </div>
              )}

              {/* ACTION: WORKFLOW STATUS CHANGER */}
               <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white">
                 <CardHeader className="bg-slate-50 border-b border-slate-100 py-5">
                   <CardTitle className="text-base text-slate-700 font-bold uppercase tracking-wider">Control Comandă</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6">
                    <div className="mb-6">
                      <p className="text-[13px] font-bold text-slate-500 mb-3 tracking-widest uppercase">Modificare Status Livrare</p>
                      <StatusEditor orderId={order.id} currentStatus={order.status} urgent={order.urgenta} />
                    </div>
                    
                    <div className="pt-6 border-t border-slate-100">
                      <PriceEditor orderId={order.id} currentPrice={order.pret} />
                    </div>
                 </CardContent>
               </Card>
               

           </div>
        </div>

      </div>
    </div>
  );
}
