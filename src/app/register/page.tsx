"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Building2, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PremiumSaaSRegisterPage() {
  const router = useRouter();
  const t = useTranslations("Auth");
  const [mounted, setMounted] = useState(false);

  // Form States
  const [userType, setUserType] = useState<"medic" | "laborator_partener">("medic");
  const [numeDoctor, setNumeDoctor] = useState("");
  const [numeClinica, setNumeClinica] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nume_doctor: numeDoctor,
            nume_clinica: numeClinica,
            telefon,
            rol: userType,
          },
        },
      });

      if (signUpError) {
        toast.error(signUpError.message || "A apărut o eroare la crearea contului.");
        return;
      }

      toast.success(t("successReg"));
      router.push("/login");
      
    } catch (err) {
      console.error(err);
      toast.error("A apărut o eroare neașteptată.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        /* Autofill patch SaaS-grade pt Chrome */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px white inset !important;
            -webkit-text-fill-color: #0f172a !important;
            transition: background-color 5000s ease-in-out 0s;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Container Principal -> True SaaS Light/Dark Split */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] w-full bg-white font-sans text-slate-900">
        
        {/* --- STÂNGA: Brand & Trust (Desktop Only or Top on Mobile) --- */}
        <div className="w-full lg:w-[45%] flex flex-col justify-between px-8 lg:px-16 xl:px-24 py-12 lg:py-20 bg-slate-50 relative overflow-hidden border-r border-slate-200/60 transition-all">
          
          {/* Subtle SaaS mesh gradients */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-[-20%] w-[60%] h-[60%] bg-blue-100/50 blur-[120px] rounded-full mix-blend-multiply" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/50 blur-[130px] rounded-full mix-blend-multiply" />
          </div>

          <div className="relative z-10">
            <img 
              src="/logo.png" 
              alt="ClaSerDent Logo" 
              className="h-28 md:h-36 xl:h-48 w-auto object-contain drop-shadow-md mb-12 sm:mb-16" 
            />

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 mb-8 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{t("accountType") || "Securitate Garantată"}</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-[3.5rem] font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight drop-shadow-sm">
              Evoluție digitală.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Simplu și eficient.
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed font-medium max-w-md">
              Deschide un cont gratuit în mai puțin de un minut și începe să colaborezi la standarde premium cu ecosistemul tău dentar.
            </p>
          </div>

          <div className="relative z-10 mt-12 hidden lg:block">
            <p className="text-sm font-semibold text-slate-400">
              © {new Date().getFullYear()} ClaSerDent Technology. Toate drepturile rezervate.
            </p>
          </div>
        </div>

        {/* --- DREAPTA: Formular Inregistrare Premium --- */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 py-10 lg:p-12 xl:p-20 relative z-10 bg-white min-h-full">
          
          <div className="w-full max-w-[500px] mx-auto py-4">
            
            <div className="mb-8 md:mb-10 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                {t("titleRegister")}
              </h2>
              <p className="text-slate-500 text-[15px] font-medium leading-relaxed">
                {t("descRegister") || "Completează rapid datele esențiale pentru a-ți crea spațiul de lucru."}
              </p>
            </div>

            {/* Toggle Modern */}
            <div className="flex p-1 rounded-xl bg-slate-100/80 mb-8 shadow-inner border border-slate-200/50 relative">
              <div 
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200/50 transition-transform duration-400 ease-out"
                style={{ transform: userType === "medic" ? "translateX(0)" : "translateX(100%)" }}
              />
              <button 
                type="button"
                onClick={() => setUserType("medic")}
                className={`relative flex-1 py-2.5 text-[13px] font-bold uppercase tracking-wider rounded-lg transition-colors z-10 ${userType === "medic" ? "text-indigo-700" : "text-slate-500 hover:text-slate-700"}`}
              >
                {t("medic")}
              </button>
              <button 
                type="button"
                onClick={() => setUserType("laborator_partener")}
                className={`relative flex-1 py-2.5 text-[13px] font-bold uppercase tracking-wider rounded-lg transition-colors z-10 ${userType === "laborator_partener" ? "text-indigo-700" : "text-slate-500 hover:text-slate-700"}`}
              >
                {t("lab")}
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nume Complet */}
                <div className="flex flex-col space-y-1.5 group">
                  <label htmlFor="numeDoctor" className="text-[12px] font-bold tracking-wide text-slate-700 ml-1">
                    {userType === "medic" ? t("doctorName") : t("repName")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      id="numeDoctor"
                      required
                      className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-[14px] text-slate-900 font-medium outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 shadow-sm transition-all placeholder:text-slate-400 placeholder:font-normal"
                      placeholder="Numele tău"
                      value={numeDoctor}
                      onChange={(e) => setNumeDoctor(e.target.value)}
                    />
                  </div>
                </div>

                {/* Nume Clinica */}
                <div className="flex flex-col space-y-1.5 group">
                  <label htmlFor="numeClinica" className="text-[12px] font-bold tracking-wide text-slate-700 ml-1">
                    {userType === "medic" ? t("clinicName") : t("labName")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Building2 className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      id="numeClinica"
                      className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-[14px] text-slate-900 font-medium outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 shadow-sm transition-all placeholder:text-slate-400 placeholder:font-normal"
                      placeholder="Opțional"
                      value={numeClinica}
                      onChange={(e) => setNumeClinica(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Telefon */}
                <div className="flex flex-col space-y-1.5 group">
                  <label htmlFor="telefon" className="text-[12px] font-bold tracking-wide text-slate-700 ml-1">
                    {t("phone")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      type="tel"
                      id="telefon"
                      required
                      className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-[14px] text-slate-900 font-medium outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 shadow-sm transition-all placeholder:text-slate-400 placeholder:font-normal"
                      placeholder="Număr de contact"
                      value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-1.5 group">
                  <label htmlFor="email" className="text-[12px] font-bold tracking-wide text-slate-700 ml-1">
                    {t("email")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-[14px] text-slate-900 font-medium outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 shadow-sm transition-all placeholder:text-slate-400 placeholder:font-normal"
                      placeholder="adresa@domeniu.ro"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Parola (Full Width) */}
              <div className="flex flex-col space-y-1.5 group">
                <label htmlFor="password" className="text-[12px] font-bold tracking-wide text-slate-700 ml-1">
                  {t("password")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-[14px] text-slate-900 font-medium outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 shadow-sm transition-all placeholder:text-slate-400 placeholder:font-normal"
                    placeholder="Minim 6 caractere"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

              {/* Buton Submit Modern */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-[15px] font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition-all outline-none focus:ring-4 focus:ring-slate-900/20 disabled:opacity-70 disabled:shadow-none flex items-center justify-center gap-2 group hover:-translate-y-[1px]"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>{t("createBtn") || "Creare Cont"}</span>
                    <ArrowRight className="h-[18px] w-[18px] group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
            </form>

            <div className="mt-8 text-center bg-slate-50/50 p-4 rounded-xl border border-slate-100/80">
              <span className="text-[14px] text-slate-500 font-medium">
                {t("alreadyHaveAccount")}
              </span>
              {" "}
              <Link 
                href="/login" 
                className="text-[14px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wide ml-1 underline decoration-indigo-200 hover:decoration-indigo-600 underline-offset-4"
              >
                {t("loginBtn")}
              </Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
