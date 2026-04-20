"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PremiumSaaSLoginPage() {
  const router = useRouter();
  const t = useTranslations("Auth");
  const ts = useTranslations("AuthSaaS");
  const [mounted, setMounted] = useState(false);

  // States
  const [userType, setUserType] = useState<"medic" | "laborator">("medic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Credențiale incorecte. Te rugăm să încerci din nou.");
        return;
      }

      if (data?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", data.user.id)
          .single();

        toast.success(t("welcomeBack"));
        
        if (profile?.rol === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
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
        <div className="w-full lg:w-[45%] flex flex-col justify-between px-6 lg:px-16 xl:px-24 py-8 lg:py-20 bg-slate-50 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200/60 transition-all">
          
          {/* Subtle SaaS mesh gradients */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-[-20%] w-[60%] h-[60%] bg-blue-100/50 blur-[120px] rounded-full mix-blend-multiply" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/50 blur-[130px] rounded-full mix-blend-multiply" />
          </div>

          <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            <img 
              src="/logo.png" 
              alt={ts("logoAlt")} 
              className="h-16 sm:h-20 md:h-28 lg:h-36 xl:h-48 w-auto object-contain drop-shadow-md mb-6 lg:mb-16" 
            />

            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 mb-8 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{ts("secureBadge")}</span>
            </div>

            <h1 className="hidden lg:block text-4xl lg:text-5xl xl:text-[3.5rem] font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight drop-shadow-sm">
              {ts("loginTitle1")}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {ts("loginTitle2")}
              </span>
            </h1>

            <p className="hidden lg:block text-lg text-slate-600 leading-relaxed font-medium max-w-md">
              {ts("loginDesc")}
            </p>
          </div>

          <div className="relative z-10 mt-12 hidden lg:block">
            <p className="text-sm font-semibold text-slate-400">
              {ts("copyright")}
            </p>
          </div>
        </div>

        {/* --- DREAPTA: Formular Login Premium --- */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 py-8 lg:p-16 xl:p-24 relative z-10 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)] lg:shadow-none">
          
          <div className="w-full max-w-md mx-auto">
            
            <div className="mb-8 md:mb-10 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                {t("welcomeBack")}
              </h2>
              <p className="text-slate-500 text-[15px] font-medium leading-relaxed">
                {t("descLogin")}
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
                onClick={() => setUserType("laborator")}
                className={`relative flex-1 py-2.5 text-[13px] font-bold uppercase tracking-wider rounded-lg transition-colors z-10 ${userType === "laborator" ? "text-indigo-700" : "text-slate-500 hover:text-slate-700"}`}
              >
                {t("lab")}
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="flex flex-col space-y-2 group">
                <label htmlFor="email" className="text-[13px] font-bold tracking-wide text-slate-700">
                  {t("email")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-[15px] text-slate-900 font-medium outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 shadow-sm transition-all placeholder:text-slate-400 placeholder:font-normal"
                    placeholder={ts("emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2 group">
                <label htmlFor="password" className="text-[13px] font-bold tracking-wide text-slate-700">
                  {t("password")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-12 text-[15px] text-slate-900 font-medium outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 shadow-sm transition-all placeholder:text-slate-400 placeholder:font-normal"
                    placeholder={ts("passPlaceholderLogin")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 pb-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-[18px] h-[18px] border-[1.5px] border-slate-300 rounded-[4px] bg-white group-hover:border-indigo-600 transition-colors shadow-sm">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className="w-2.5 h-2.5 bg-indigo-600 rounded-[2px] scale-0 peer-checked:scale-100 transition-transform duration-200" />
                  </div>
                  <span className="text-slate-600 text-[13px] font-semibold transition-colors group-hover:text-slate-900">
                    {t("rememberMe")}
                  </span>
                </label>
                
                <Link 
                  href="/forgot-password" 
                  className="text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-4 text-[13px] font-bold transition-all"
                >
                  {t("forgotPasswordQ")}
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-[15px] font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition-all outline-none focus:ring-4 focus:ring-slate-900/20 disabled:opacity-70 disabled:shadow-none flex items-center justify-center gap-2 group hover:-translate-y-[1px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{ts("processing")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("loginBtn")}</span>
                    <ArrowRight className="h-[18px] w-[18px] group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
            </form>

            <div className="mt-8 text-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <span className="text-[14px] text-slate-500 font-medium">
                {t("noAccount")}
              </span>
              {" "}
              <Link 
                href="/register" 
                className="text-[14px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wide ml-1 underline decoration-indigo-200 hover:decoration-indigo-600 underline-offset-4"
              >
                {t("registerLink")}
              </Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
