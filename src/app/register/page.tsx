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
  const ts = useTranslations("AuthSaaS");
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

  // Auth States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [redirectPath, setRedirectPath] = useState<string>("/medic");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUser(data.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", data.user.id)
          .single();
        if (profile?.rol === "admin") {
          setRedirectPath("/admin");
        } else if (profile?.rol === "laborator_partener") {
          setRedirectPath("/laborator");
        }
      }
      setMounted(true);
      setIsCheckingAuth(false);
    };
    checkUser();
  }, []);

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
        <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-6 lg:px-12 xl:px-16 py-12 bg-slate-50 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200/60 transition-all">
          
          {/* Subtle SaaS mesh gradients */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-blue-400/20 blur-[130px] rounded-full mix-blend-multiply" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-violet-400/20 blur-[140px] rounded-full mix-blend-multiply" />
          </div>

          <div className="relative z-10 flex flex-col items-center w-full max-w-lg mx-auto">
            <img 
              src="/logo.png" 
              alt={ts("logoAlt")} 
              className="h-20 sm:h-24 md:h-32 lg:h-40 xl:h-56 w-auto object-contain drop-shadow-xl mb-8 lg:mb-12 hover:scale-105 transition-transform duration-700 ease-out" 
            />

            <div className="hidden lg:flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] mb-8">
                <ShieldCheck className="w-[18px] h-[18px] text-indigo-600" />
                <span className="text-[13px] font-bold text-slate-800 uppercase tracking-[0.15em]">{ts("secureBadge")}</span>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-[3.5rem] font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight drop-shadow-sm">
                {ts("regTitle1")}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 font-black">
                  {ts("regTitle2")}
                </span>
              </h1>

              <p className="text-lg xl:text-xl text-slate-600 leading-relaxed font-medium mb-8">
                {ts("regDesc")}
              </p>

              <ul className="space-y-4 text-slate-500 font-medium text-[15px] md:text-base list-none text-left tracking-wide opacity-90 mx-auto">
                <li className="flex items-center justify-center lg:justify-start gap-3">
                   <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                   {ts("bullet1")}
                </li>
                <li className="flex items-center justify-center lg:justify-start gap-3">
                   <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                   {ts("bullet2")}
                </li>
              </ul>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 z-10 hidden lg:flex justify-center">
            <p className="text-sm font-bold text-slate-400/80 tracking-wide uppercase">
              {ts("copyright")}
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 py-8 lg:p-12 xl:p-20 relative z-10 bg-white min-h-full shadow-[0_-10px_20px_rgba(0,0,0,0.02)] lg:shadow-none">
          
          <div className="w-full max-w-[500px] mx-auto py-4">
            
            {isCheckingAuth ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-slate-500 font-medium">{ts("checkingSession")}</p>
              </div>
            ) : currentUser ? (
              <div className="text-center bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 xl:p-12 shadow-sm animate-in fade-in zoom-in duration-500">
                <div className="mx-auto w-16 h-16 bg-white border-2 border-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <ShieldCheck className="h-8 w-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                  {ts("alreadyLoggedTitle")}
                </h2>
                <p className="text-slate-500 text-[15px] font-medium leading-relaxed mb-8">
                  {ts("alreadyLoggedDesc1")} <br /> 
                  <span className="font-bold text-slate-800 break-all">{currentUser.email}</span> <br /> 
                  {ts("alreadyLoggedDesc2")}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.href = redirectPath}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] sm:text-[15px] font-bold shadow-[0_4px_14px_0_rgba(79,70,229,0.25)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.3)] transition-all outline-none focus:ring-4 focus:ring-indigo-600/20 flex items-center justify-center gap-2 group hover:-translate-y-[1px]"
                >
                  <span>{ts("enterDashboard")}</span>
                  <ArrowRight className="h-[18px] w-[18px] group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="mt-6 flex justify-center">
                  <form action="/auth/signout" method="POST">
                    <button className="text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors underline underline-offset-4 decoration-slate-200 hover:decoration-slate-400">
                      {ts("reAuthBtn")}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8 md:mb-10 text-center lg:text-left">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                    {t("titleRegister")}
                  </h2>
                  <p className="text-slate-500 text-[15px] font-medium leading-relaxed">
                    {ts("regDesc")}
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
                          placeholder={ts("namePlaceholder")}
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
                          placeholder={ts("clinicPlaceholder")}
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
                          placeholder={ts("phonePlaceholder")}
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
                          placeholder={ts("emailPlaceholder")}
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
                        placeholder={ts("passPlaceholderReg")}
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
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>{ts("processing")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("createBtn")}</span>
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
              </>
            )}

          </div>
        </div>

      </div>
    </>
  );
}
