"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from "lucide-react";

export default function LuxuryLoginPage() {
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
          icon: <Sparkles className="w-5 h-5 text-indigo-500" />,
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
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); filter: blur(8px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

      {/* Container Full aerisit, Split Screen */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] w-full bg-white font-sans">
        
        {/* --- STÂNGA: Prezentare (Desktop) - 50% lățime --- */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center px-12 xl:px-20 bg-slate-50 relative overflow-hidden border-r border-slate-200/60 shadow-[inset_-20px_0_40px_rgba(0,0,0,0.015)]">
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-200/40 blur-[130px] rounded-full mix-blend-multiply" />
            <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[60%] bg-indigo-200/40 blur-[130px] rounded-full mix-blend-multiply" />
          </div>

          <div className="relative z-10 w-full max-w-xl opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 border border-indigo-200 mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-[13px] font-bold text-indigo-700 uppercase tracking-widest">Platformă Enterprise</span>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight drop-shadow-sm">
              Colaborare la <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                standarde de excelență
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed font-light max-w-md mb-8">
              Conectăm medicii stomatologi cu laboratoarele dentare pentru o eficiență maximă, transparență totală și lucrări impecabil executate.
            </p>
          </div>

          <div className="relative z-10 mt-auto pt-16 opacity-0 animate-fade-in-up flex items-center gap-6" style={{ animationDelay: '300ms' }}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left w-full">
              © {new Date().getFullYear()} ClaSerDent Technology. Toate drepturile rezervate.
            </p>
          </div>
        </div>

        {/* --- DREAPTA: Formular Login Aerisit - 50% lățime --- */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 py-10 lg:px-16 xl:px-24 relative z-10 min-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
          
          <div className={`w-full max-w-lg mx-auto py-8 transition-transform duration-500 opacity-0 animate-fade-in-up ${errorShake ? 'animate-shake' : ''}`} style={{ animationDelay: '200ms' }}>
            
            <div className="mb-8">
              <h2 className="text-3xl xl:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Bine ai revenit.</h2>
              <p className="text-slate-500 text-base">
                Autentifică-te pentru a accesa platforma.
              </p>
            </div>

            {/* Toggle Roluri */}
            <div className="flex p-1.5 rounded-2xl bg-slate-100/70 border border-slate-200/50 mb-8 relative shadow-inner">
              <div 
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) border border-slate-200/60"
                style={{ transform: userType === "medic" ? "translateX(0)" : "translateX(100%)" }}
              />
              <button 
                type="button"
                onClick={() => setUserType("medic")}
                className={`relative flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 z-10 ${userType === "medic" ? "text-indigo-700" : "text-slate-500 hover:text-slate-800"}`}
              >
                Sunt Medic
              </button>
              <button 
                type="button"
                onClick={() => setUserType("laborator")}
                className={`relative flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 z-10 ${userType === "laborator" ? "text-indigo-700" : "text-slate-500 hover:text-slate-800"}`}
              >
                Sunt Laborator
              </button>
            </div>

            {/* Formular login */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="flex flex-col space-y-2 group">
                <label htmlFor="name" className="text-xs font-bold tracking-widest text-slate-500 uppercase ml-1">
                  {userType === "medic" ? "Nume doctor" : "Nume laborator"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white shadow-sm py-3.5 pl-12 pr-4 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
                    placeholder={userType === "medic" ? "ex: Dr. Ion Popescu" : "ex: Lab Dent Art"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2 group">
                <label htmlFor="email" className="text-xs font-bold tracking-widest text-slate-500 uppercase ml-1">
                  Adresa de email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white shadow-sm py-3.5 pl-12 pr-4 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
                    placeholder="ex: nume@clinica.ro"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2 group">
                <label htmlFor="password" className="text-xs font-bold tracking-widest text-slate-500 uppercase ml-1">
                  Parolă
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white shadow-sm py-3.5 pl-12 pr-14 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
                    placeholder="Minim 6 caractere"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors outline-none focus:text-indigo-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 pb-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 border-[1.5px] border-slate-300 rounded-md bg-white group-hover:border-indigo-600 transition-colors shadow-sm">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className="w-2.5 h-2.5 bg-indigo-600 rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)" />
                  </div>
                  <span className="text-slate-700 group-hover:text-slate-900 text-sm font-semibold transition-colors">
                    Ține-mă minte
                  </span>
                </label>
                
                <Link 
                  href="/forgot-password" 
                  className="text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-4 text-sm font-bold transition-all"
                >
                  Ai uitat parola?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-base font-bold shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-[1px] transition-all outline-none focus:ring-4 focus:ring-indigo-600/30 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none group"
              >
                <div className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Se procesează...</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-wide">Autentificare în cont</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </div>
              </button>
              
            </form>

            <div className="mt-10 text-center">
              <span className="text-[15px] font-medium text-slate-500">Nu ai un cont încă? </span>
              <Link 
                href="/register" 
                className="text-[15px] font-bold text-slate-900 hover:text-indigo-600 transition-colors underline decoration-slate-300 hover:decoration-indigo-600 underline-offset-4"
              >
                Creează cont nou
              </Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
