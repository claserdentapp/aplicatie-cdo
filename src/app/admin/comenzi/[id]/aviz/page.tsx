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
      "id,created_at,nume_pacient,tip_lucrare,material,culoare_vita,status,urgenta,data_intrare,data_livrare_estimata,instructiuni,pret,doctor_id,doctor:profiles(nume_doctor,nume_clinica,telefon)",
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

  return (
    <div className="min-h-screen bg-gray-100 text-black p-4 md:p-8 font-sans print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto border sm:shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-12 bg-white print:border-none print:shadow-none">
        {/* Print controls (hidden in print) */}
        <div className="mb-8 flex justify-end print:hidden">
          <PrintButton />
        </div>

        {/* Header */}
        <div className="text-center mb-10 pb-8 border-b-2 border-gray-900">
          <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-gray-900 mb-4">Fișă de laborator</h1>
          <h2 className="text-xl font-bold text-gray-800">Laborator de Tehnică Dentară</h2>
          <h3 className="text-lg font-bold text-indigo-700 mt-1">ClaSerDent Technology S.R.L.</h3>
          
          <div className="text-[15px] font-medium text-gray-600 mt-4 flex flex-col items-center gap-1">
            <p><span className="font-bold text-gray-800">CUI:</span> 47130210</p>
            <p><span className="font-bold text-gray-800">Adresă:</span> Calea Clujului Nr. 231 C, Oradea, Bihor</p>
            <p><span className="font-bold text-gray-800">Email:</span> claserdenttechnology@gmail.com</p>
            <p><span className="font-bold text-gray-800">Telefon:</span> 0773 783 114</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-10 text-[16px]">
          <div className="flex flex-col border-b border-gray-300 pb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Dl./Dna. Doctor:</span>
            <span className="font-bold text-xl text-gray-900">{doctor?.nume_doctor ?? order.doctor_id}</span>
            {doctor?.nume_clinica && <span className="text-sm font-semibold text-gray-600 mt-1">{doctor.nume_clinica}</span>}
          </div>
          <div className="flex flex-col border-b border-gray-300 pb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pacient Dl./Dna:</span>
            <span className="font-bold text-xl text-gray-900">{order.nume_pacient}</span>
          </div>

          <div className="flex flex-col border-b border-gray-300 pb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Felul lucrării:</span>
            <span className="font-bold text-lg text-gray-800">
              {order.tip_lucrare} 
              {order.urgenta ? <span className="text-red-600 ml-2 text-sm uppercase tracking-widest font-black bg-red-50 px-2 py-0.5 rounded">(URGENȚĂ)</span> : ""}
            </span>
          </div>

          <div className="flex flex-row items-end border-b border-gray-300 pb-2">
             <div className="flex-1">
               <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Culoare:</span>
               <span className="font-bold text-lg text-gray-900">{order.culoare_vita || "................"}</span>
             </div>
             <div className="flex-1 border-l border-gray-300 pl-5">
               <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">La colet:</span>
               <span className="font-bold text-lg text-gray-300">........................</span>
             </div>
          </div>

          <div className="flex flex-col border-b border-gray-300 pb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Forma dinților:</span>
            <span className="font-bold text-base text-gray-300 mt-1">....................................................................</span>
          </div>
          
          <div className="flex items-end border-b border-gray-300 pb-2">
            <div className="flex-1">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Data Intrare:</span>
              <span className="font-bold text-lg text-gray-900">{order.data_intrare}</span>
            </div>
            <div className="flex-1 border-l border-gray-300 pl-5">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Termen de livrare:</span>
              <span className="font-bold text-lg text-gray-900">{order.data_livrare_estimata || "........................"}</span>
            </div>
          </div>
        </div>

        {/* Materials list */}
        <div className="mb-10 p-6 bg-[#f8fafc] border border-slate-200 rounded-xl print:bg-white print:border-gray-300">
           <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Material solicitat:</h4>
           <div className="flex flex-wrap gap-x-8 gap-y-4 text-base font-semibold">
             {["Zirconiu", "Emax", "Aur", "CrCo", "Cr.Ni", "Titan", "Metal-Ceramică", "Acrilic"].map(mat => {
                const orderMaterial = (order.material || "").toLowerCase();
                const currentMat = mat.toLowerCase();
                const isSelected = orderMaterial === currentMat || orderMaterial.includes(currentMat);
                
                return (
                  <label key={mat} className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-6 h-6 border-2 rounded flex items-center justify-center print:border-gray-400 ${isSelected ? 'border-indigo-600 bg-indigo-50 print:bg-gray-100' : 'border-gray-300 bg-white'}`}>
                      {isSelected && <div className="w-3.5 h-3.5 bg-indigo-600 rounded-sm print:bg-black" />}
                    </div>
                    <span className={isSelected ? 'text-indigo-900 font-bold print:text-black' : 'text-gray-700'}>{mat}</span>
                  </label>
                )
             })}
           </div>
        </div>

        {/* Notes and Sketch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Notițe / Instrucțiuni Specifice:</h4>
            <div className="min-h-[220px] border border-gray-300 p-5 rounded-xl bg-[#fffbeb] print:bg-white text-gray-800 whitespace-pre-wrap text-[15px] leading-relaxed shadow-inner">
              {order.instructiuni || <span className="text-gray-300 leading-[2.5rem]">........................................................................................................................................................................................................................................................................................................................................................................................................................</span>}
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Schița pentru culoare:</h4>
            <div className="min-h-[220px] border border-gray-300 p-4 rounded-xl bg-white relative flex items-center justify-center print:border-dashed">
                <span className="text-gray-100 text-[100px] opacity-40 select-none print:opacity-20">🦷</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 border-t-2 border-gray-900 text-[11px] font-bold text-gray-500 text-center uppercase tracking-widest leading-loose">
          <p>Această fișă de laborator este o comandă și se va executa conform condițiilor noastre de confecționare, livrare și plată.</p>
          <p>De asemenea, ea reprezintă și confirmarea comenzii și afară de aceasta nu există o altă confirmare.</p>
        </div>
      </div>
    </div>
  );
}
