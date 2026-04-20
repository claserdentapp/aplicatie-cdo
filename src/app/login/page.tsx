"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from "lucide-react";

export default function ValidatedLoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // States
  const [userType, setUserType] = useState<"medic" | "laborator">("medic");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorShake(false);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Credențiale incorecte. Te rugăm să încerci din nou.");
        triggerErrorShake();
        return;
      }

      if (data?.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", data.user.id)
          .single();

        if (profileError) console.error("Profile error:", profileError);

        toast.success("Autentificare reușită!", {
          icon: <Sparkles className="w-4 h-4 text-indigo-500" />,
        });
        
        if (profile?.rol === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("A apărut o eroare neașteptată.");
      triggerErrorShake();
    } finally {
      setIsLoading(false);
    }
  };

  const triggerErrorShake = () => {
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 500);
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Remediere fundal alb autofill in Chrome */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px white inset !important;
            -webkit-text-fill-color: #0f172a !important;
            transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Container adaptat pentru a evita scrollbar cu navbar-ul de sus existent */}
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 text-slate-900 flex flex-col lg:flex-row overflow-hidden font-sans relative selection:bg-indigo-500/20">
        
        {/* Soft Background Blobs for White Theme */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-100/50 mix-blend-multiply blur-[120px] opacity-70" />
          <div className="absolute bottom-0 right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-100/50 mix-blend-multiply blur-[120px] opacity-70" />
        </div>

        {/* --- STÂNGA: Prezentare (Desktop) --- */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center p-12 lg:px-24 relative z-10">
          <div className="relative z-20 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-700 tracking-wide">Experiență Digitală Completă</span>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight mb-6 text-slate-900 drop-shadow-sm">
              Colaborare la <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                standarde de excelență
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-md leading-relaxed font-normal">
              Conectăm medicii stomatologi cu laboratoarele dentare pentru o eficiență maximă, transparență totală și lucrări impecabil executate.
            </p>
          </div>

          <div className="relative z-20 mt-16 opacity-0 animate-fade-in-up flex items-center gap-6" style={{ animationDelay: '300ms' }}>
            <p className="text-sm font-medium text-slate-400">
              © {new Date().getFullYear()} ClaSerDent Technology.
            </p>
          </div>
        </div>

        {/* --- DREAPTA: Formular Login --- */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
          
          <div className={`w-full max-w-[420px] relative transition-transform duration-500 ${errorShake ? 'animate-shake' : ''}`}>
            
            <div className="bg-white p-8 sm:p-10 rounded-3xl opacity-0 animate-fade-in-up shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 relative overflow-hidden group" style={{ animationDelay: '200ms' }}>
              
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Bine ai revenit</h2>
                <p className="text-slate-500 text-[15px]">
                  Autentifică-te pentru a accesa contul tău
                </p>
              </div>

              {/* Toggle Roluri */}
              <div className="flex p-1.5 rounded-[1.25rem] bg-slate-100/80 border border-slate-200/50 mb-8 relative z-20 shadow-inner">
                <div 
                  className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) border border-slate-200/50"
                  style={{ transform: userType === "medic" ? "translateX(0)" : "translateX(100%)" }}
                />
                <button 
                  type="button"
                  onClick={() => setUserType("medic")}
                  className={`relative flex-1 py-2.5 text-[14px] font-semibold rounded-xl transition-all duration-300 z-10 ${userType === "medic" ? "text-indigo-700" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Sunt Medic
                </button>
                <button 
                  type="button"
                  onClick={() => setUserType("laborator")}
                  className={`relative flex-1 py-2.5 text-[14px] font-semibold rounded-xl transition-all duration-300 z-10 ${userType === "laborator" ? "text-indigo-700" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Sunt Laborator
                </button>
              </div>

              {/* Formular login */}
              <form onSubmit={handleLogin} className="space-y-4 relative z-20">
                
                {/* Input Nume */}
                <div className="relative group rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 overflow-hidden shadow-sm">
                  <div className="absolute top-1/2 -translate-y-1/2 left-5 pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 group-focus-within:scale-110 transition-all duration-300" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    required
                    className="peer block w-full h-[60px] bg-transparent pl-14 pr-5 pt-5 pb-1 text-[15px] font-medium text-slate-900 placeholder-transparent focus:outline-none"
                    placeholder="Nume"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-14 top-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-indigo-600 pointer-events-none"
                  >
                    {userType === "medic" ? "Nume doctor" : "Nume laborator"}
                  </label>
                </div>

                {/* Input Email */}
                <div className="relative group rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 overflow-hidden shadow-sm">
                  <div className="absolute top-1/2 -translate-y-1/2 left-5 pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 group-focus-within:scale-110 transition-all duration-300" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    className="peer block w-full h-[60px] bg-transparent pl-14 pr-5 pt-5 pb-1 text-[15px] font-medium text-slate-900 placeholder-transparent focus:outline-none"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-14 top-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-indigo-600 pointer-events-none"
                  >
                    Adresa de email
                  </label>
                </div>

                {/* Input Parolă */}
                <div className="relative group rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 overflow-hidden shadow-sm">
                  <div className="absolute top-1/2 -translate-y-1/2 left-5 pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 group-focus-within:scale-110 transition-all duration-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    className="peer block w-full h-[60px] bg-transparent pl-14 pr-16 pt-5 pb-1 text-[15px] font-medium text-slate-900 placeholder-transparent focus:outline-none"
                    placeholder="Parolă"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-14 top-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-indigo-600 pointer-events-none"
                  >
                    Parolă
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-1"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 pb-6 text-sm">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 border border-slate-300 rounded-md bg-white group-hover:border-indigo-500 transition-colors shadow-sm">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <div className="w-3 h-3 bg-indigo-600 rounded-[3px] scale-0 peer-checked:scale-100 transition-transform duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)" />
                    </div>
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors font-medium">
                      Ține-mă minte
                    </span>
                  </label>
                  
                  <Link 
                    href="/forgot-password" 
                    className="text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-all font-medium"
                  >
                    Ai uitat parola?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full rounded-2xl bg-indigo-600 px-4 py-4 text-[15px] font-semibold text-white shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] transition-all duration-300 hover:bg-indigo-700 hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-[0_2px_10px_rgba(79,70,229,0.2)] disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none overflow-hidden group"
                >
                  <div className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Se procesează...</span>
                      </>
                    ) : (
                      <>
                        <span>Autentificare în cont</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
                
              </form>

              <div className="mt-8 text-center text-[15px] text-slate-500 relative z-20">
                Nu ai un cont încă?{" "}
                <Link 
                  href="/register" 
                  className="text-slate-900 hover:text-indigo-600 font-semibold transition-colors hover:underline underline-offset-4 decoration-slate-300 hover:decoration-indigo-600"
                >
                  Creează cont nou
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}
