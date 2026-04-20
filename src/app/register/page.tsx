"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Building2, Phone, ArrowRight } from "lucide-react";
import { useTranslations, NextIntlClientProvider } from "next-intl";

export default function RegisterPage() {
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
        /* Autofill patch pt Chrome ca sa nu strice culoarea inputurilor */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #bcdcec inset !important;
            -webkit-text-fill-color: #315467 !important;
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

      {/* Container Principal */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] w-full bg-slate-50/50 font-sans p-6 lg:p-12 xl:p-20 overflow-x-hidden">
        
        {/* --- STÂNGA: Layout Prezentare --- */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center lg:pr-16 xl:pr-24 mb-16 lg:mb-0">
          
          {/* Logo / Imagine Dinte din Mockup */}
          <div className="flex justify-center mb-16 w-full max-w-[300px] mx-auto lg:mx-0">
            {/* Fallback svg de dinte digital daca lipseste png-ul */}
            <svg viewBox="0 0 200 200" className="w-32 h-32 md:w-48 md:h-48 drop-shadow-sm">
               <path d="M 60 40 C 60 10, 100 10, 100 30 C 100 10, 140 10, 140 40 C 140 80, 120 100, 120 140 C 120 180, 105 190, 100 190 C 95 190, 80 180, 80 140 C 80 100, 60 80, 60 40 Z" fill="none" stroke="#2dd4bf" strokeWidth="8" />
               <path d="M 60 40 L 100 60 L 140 40 M 80 140 L 100 90 L 120 140" stroke="#0ea5e9" strokeWidth="4" fill="none"/>
               <circle cx="100" cy="90" r="4" fill="#0ea5e9"/>
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-[#3a4d5c] leading-tight mb-10 tracking-tight">
            Viitorul <span className="text-[#64a5c3]">colaborării dentare</span> începe aici.
          </h1>

          <ul className="space-y-6 text-[#699cb4] font-bold text-lg md:text-xl list-disc pl-6 leading-relaxed">
            <li>
              Digitalizează modul în care lucrezi cu laboratorul sau clinica ta.
            </li>
            <li>
              Mai puține telefoane, mai mult control, rezultate mai bune pentru pacienții tăi.
            </li>
          </ul>
        </div>

        {/* --- DREAPTA: Formular Box Albastru --- */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          
          <div className="w-full max-w-lg mx-auto">
            {/* Titlu Formular Exterior */}
            <h2 className="text-2xl md:text-[28px] font-extrabold text-[#3a4d5c] mb-6 text-center lg:text-left drop-shadow-sm leading-snug">
              Bine ai venit! <span className="text-[#397d9e]">{t("titleRegister") || "Creează-ți un cont nou."}</span>
            </h2>

            {/* BOX ALBASTRU FORMULAR */}
            <div className="bg-[#4585a6] p-6 sm:p-8 rounded-xl shadow-lg border border-[#3b7391]">
              
              {/* Toggle Roluri */}
              <div className="flex p-1.5 rounded-full bg-[#bcdcec] mb-8 relative shadow-inner">
                <div 
                  className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-sm transition-transform duration-500 ease-in-out"
                  style={{ transform: userType === "medic" ? "translateX(0)" : "translateX(100%)" }}
                />
                <button 
                  type="button"
                  onClick={() => setUserType("medic")}
                  className={`relative flex-1 py-3 text-xs md:text-sm font-extrabold uppercase tracking-wide rounded-full transition-colors z-10 ${userType === "medic" ? "text-slate-900" : "text-[#2e5d75] hover:text-[#1d3d4d]"}`}
                >
                  {t("medic")}
                </button>
                <button 
                  type="button"
                  onClick={() => setUserType("laborator_partener")}
                  className={`relative flex-1 py-3 text-xs md:text-sm font-extrabold uppercase tracking-wide rounded-full transition-colors z-10 ${userType === "laborator_partener" ? "text-slate-900" : "text-[#2e5d75] hover:text-[#1d3d4d]"}`}
                >
                  {t("lab")}
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                
                {/* Rândul 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nume Medic/Lab */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="numeDoctor" className="text-[11px] font-extrabold text-white uppercase tracking-wider pl-1">
                      {userType === "medic" ? t("doctorName") : t("repName")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-[18px] w-[18px] text-[#558299] stroke-[2.5]" />
                      </div>
                      <input
                        type="text"
                        id="numeDoctor"
                        required
                        className="block w-full rounded-full bg-[#bcdcec] py-3.5 pl-11 pr-4 text-[14px] text-[#1b3d4f] font-bold outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-[#8baabf]"
                        value={numeDoctor}
                        onChange={(e) => setNumeDoctor(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Nume Clinică */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="numeClinica" className="text-[11px] font-extrabold text-white uppercase tracking-wider pl-1">
                      {userType === "medic" ? t("clinicName") : t("labName")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-[18px] w-[18px] text-[#558299] stroke-[2.5]" />
                      </div>
                      <input
                        type="text"
                        id="numeClinica"
                        className="block w-full rounded-full bg-[#bcdcec] py-3.5 pl-11 pr-4 text-[14px] text-[#1b3d4f] font-bold outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-[#8baabf]"
                        value={numeClinica}
                        onChange={(e) => setNumeClinica(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Rândul 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Telefon */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="telefon" className="text-[11px] font-extrabold text-white uppercase tracking-wider pl-1">
                      {t("phone")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-[18px] w-[18px] text-[#558299] stroke-[2.5]" />
                      </div>
                      <input
                        type="tel"
                        id="telefon"
                        required
                        className="block w-full rounded-full bg-[#bcdcec] py-3.5 pl-11 pr-4 text-[14px] text-[#1b3d4f] font-bold outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-[#8baabf]"
                        value={telefon}
                        onChange={(e) => setTelefon(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="email" className="text-[11px] font-extrabold text-white uppercase tracking-wider pl-1">
                      {t("email")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-[18px] w-[18px] text-[#558299] stroke-[2.5]" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        required
                        className="block w-full rounded-full bg-[#bcdcec] py-3.5 pl-11 pr-4 text-[14px] text-[#1b3d4f] font-bold outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-[#8baabf]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Parola (Full width) */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="password" className="text-[11px] font-extrabold text-white uppercase tracking-wider pl-1">
                    {t("password")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-[18px] w-[18px] text-[#558299] stroke-[2.5]" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      required
                      className="block w-full rounded-full bg-[#bcdcec] py-3.5 pl-11 pr-12 text-[14px] text-[#1b3d4f] font-bold outline-none focus:ring-2 focus:ring-white/30 transition-all placeholder:text-[#8baabf]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#558299] hover:text-[#1b3d4f] transition-colors outline-none"
                    >
                      {showPassword ? <EyeOff className="h-[20px] w-[20px]" /> : <Eye className="h-[20px] w-[20px]" />}
                    </button>
                  </div>
                </div>

                {/* Buton Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3.5 rounded-full bg-[#bcdcec] hover:bg-[#a6cbdf] active:bg-[#92bbd2] text-[#1f3747] text-[15px] font-extrabold transition-all outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-70 disabled:shadow-none group shadow-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span>{t("titleRegister") || "Înregistrare cont"}</span>
                      <ArrowRight className="h-4 w-4 stroke-[2.5] mt-[1px]" />
                    </>
                  )}
                </button>
                
              </form>

              {/* Text Footer in interiorul cardului albastru */}
              <div className="mt-6 text-center">
                <Link 
                  href="/login" 
                  className="text-[13px] font-bold text-[#1f3747] hover:text-white transition-colors"
                >
                  {t("alreadyHaveAccount")} {t("loginBtn")}
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}
