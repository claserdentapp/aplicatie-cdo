"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Building2, Phone, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

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
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] w-full bg-[#f8fbfa] font-sans">
        
        {/* --- STÂNGA: Prezentare (45% din spatiu) --- */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 lg:pl-16 xl:pl-24 py-16 lg:py-0">
          
          {/* Logo Companie (înlocuire dinte per cerință) */}
          <div className="flex justify-center lg:justify-start mb-12 lg:mb-16">
            <img 
              src="/logo.png" 
              alt="ClaSerDent Logo" 
              className="h-24 md:h-32 xl:h-40 object-contain drop-shadow-sm" 
            />
          </div>

          <h1 className="text-3xl md:text-4xl xl:text-5xl font-black text-[#3a4d5c] leading-tight mb-10 tracking-tight text-center lg:text-left">
            Viitorul <span className="text-[#64a5c3]">colaborării dentare</span> începe aici.
          </h1>

          <ul className="space-y-6 text-[#699cb4] font-bold text-lg md:text-xl list-disc pl-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
            <li>
              Digitalizează modul în care lucrezi cu laboratorul sau clinica ta.
            </li>
            <li>
              Mai puține telefoane, mai mult control, rezultate mai bune pentru pacienții tăi.
            </li>
          </ul>
        </div>

        {/* --- DREAPTA: Formular Gigant (55% cu margine drăguță) --- */}
        <div className="w-full lg:w-[55%] flex lg:p-6 lg:pr-10 xl:pr-16 mb-6 lg:mb-0 relative z-10">
          
          <div className="w-full h-full bg-[#4585a6] lg:rounded-[2.5rem] p-8 md:p-12 xl:p-16 flex flex-col justify-center shadow-2xl border border-[#3b7391]/30 mx-auto max-w-full relative overflow-hidden">
            
            {/* Decorațiuni invizibile pt wow-factor in interiorul marginii */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-white/5 blur-3xl rounded-bl-full pointer-events-none" />

            {/* Titlu mutat IN interior, deoarece caseta ocupa totul */}
            <div className="mb-10 text-center lg:text-left relative z-10">
              <h2 className="text-3xl lg:text-[40px] font-black text-white leading-[1.1] tracking-tight">
                Bine ai venit! <br className="hidden xl:block" />
                <span className="text-[#bcdcec]">{t("titleRegister") || "Creare cont."}</span>
              </h2>
            </div>

            {/* Toggle Roluri */}
            <div className="flex p-1.5 rounded-full bg-[#bcdcec] mb-10 relative shadow-inner max-w-sm w-full mx-auto lg:mx-0 z-10">
              <div 
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-md transition-transform duration-500 ease-in-out"
                style={{ transform: userType === "medic" ? "translateX(0)" : "translateX(100%)" }}
              />
              <button 
                type="button"
                onClick={() => setUserType("medic")}
                className={`relative flex-1 py-3.5 text-xs md:text-[13px] font-black uppercase tracking-widest rounded-full transition-colors z-10 ${userType === "medic" ? "text-[#1f3747]" : "text-[#558299] hover:text-[#1d3d4d]"}`}
              >
                {t("medic")}
              </button>
              <button 
                type="button"
                onClick={() => setUserType("laborator_partener")}
                className={`relative flex-1 py-3.5 text-xs md:text-[13px] font-black uppercase tracking-widest rounded-full transition-colors z-10 ${userType === "laborator_partener" ? "text-[#1f3747]" : "text-[#558299] hover:text-[#1d3d4d]"}`}
              >
                {t("lab")}
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-6 relative z-10">
              
              {/* Rândul 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="numeDoctor" className="text-xs font-black text-white uppercase tracking-widest pl-1">
                    {userType === "medic" ? t("doctorName") : t("repName")}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-[#558299] group-focus-within:text-[#1b3d4f] transition-colors stroke-[2.5]" />
                    </div>
                    <input
                      type="text"
                      id="numeDoctor"
                      required
                      className="block w-full rounded-full bg-[#bcdcec] py-4 pl-12 pr-5 text-[15px] text-[#1b3d4f] font-bold outline-none focus:ring-4 focus:ring-white/20 transition-all placeholder:text-[#8baabf]"
                      value={numeDoctor}
                      onChange={(e) => setNumeDoctor(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="numeClinica" className="text-xs font-black text-white uppercase tracking-widest pl-1">
                    {userType === "medic" ? t("clinicName") : t("labName")}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-[#558299] group-focus-within:text-[#1b3d4f] transition-colors stroke-[2.5]" />
                    </div>
                    <input
                      type="text"
                      id="numeClinica"
                      className="block w-full rounded-full bg-[#bcdcec] py-4 pl-12 pr-5 text-[15px] text-[#1b3d4f] font-bold outline-none focus:ring-4 focus:ring-white/20 transition-all placeholder:text-[#8baabf]"
                      value={numeClinica}
                      onChange={(e) => setNumeClinica(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Rândul 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="telefon" className="text-xs font-black text-white uppercase tracking-widest pl-1">
                    {t("phone")}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-[#558299] group-focus-within:text-[#1b3d4f] transition-colors stroke-[2.5]" />
                    </div>
                    <input
                      type="tel"
                      id="telefon"
                      required
                      className="block w-full rounded-full bg-[#bcdcec] py-4 pl-12 pr-5 text-[15px] text-[#1b3d4f] font-bold outline-none focus:ring-4 focus:ring-white/20 transition-all placeholder:text-[#8baabf]"
                      value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-xs font-black text-white uppercase tracking-widest pl-1">
                    {t("email")}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#558299] group-focus-within:text-[#1b3d4f] transition-colors stroke-[2.5]" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      className="block w-full rounded-full bg-[#bcdcec] py-4 pl-12 pr-5 text-[15px] text-[#1b3d4f] font-bold outline-none focus:ring-4 focus:ring-white/20 transition-all placeholder:text-[#8baabf]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Parola (Full width) */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="password" className="text-xs font-black text-white uppercase tracking-widest pl-1">
                  {t("password")}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#558299] group-focus-within:text-[#1b3d4f] transition-colors stroke-[2.5]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    className="block w-full rounded-full bg-[#bcdcec] py-4 pl-12 pr-14 text-[15px] text-[#1b3d4f] font-bold outline-none focus:ring-4 focus:ring-white/20 transition-all placeholder:text-[#8baabf]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#558299] hover:text-[#1b3d4f] transition-colors outline-none"
                  >
                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                  </button>
                </div>
              </div>

              {/* Buton Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-4 rounded-full bg-[#bcdcec] hover:bg-[#a6cbdf] active:bg-[#92bbd2] text-[#1f3747] text-base lg:text-lg font-black transition-all outline-none focus:ring-4 focus:ring-white/30 disabled:opacity-70 disabled:shadow-none shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <span className="uppercase tracking-widest">{t("createBtn") || "Creare Cont"}</span>
                    <ArrowRight className="h-5 w-5 stroke-[3] ml-1" />
                  </>
                )}
              </button>
              
            </form>

            <div className="mt-8 text-center relative z-10 pt-4 border-t border-white/10">
              <Link 
                href="/login" 
                className="text-sm font-bold text-[#1f3747] hover:text-white transition-colors uppercase tracking-widest"
              >
                {t("alreadyHaveAccount")} <span className="underline decoration-[#1f3747] hover:decoration-white underline-offset-4">{t("loginBtn")}</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
