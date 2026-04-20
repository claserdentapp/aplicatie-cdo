"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

export default function PremiumLoginPage() {
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

  // Evitam hidratarea gresita
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

        if (profileError) {
          console.error("Profile fetch error:", profileError);
        }

        toast.success("Autentificare reușită!", {
          icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
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
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes text-shimmer {
          from { background-position: 200% center; }
          to { background-position: -200% center; }
        }
        .animate-text-shimmer {
          animation: text-shimmer 4s linear infinite;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.4),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
            inset 0 0 0 1px rgba(255, 255, 255, 0.02);
        }
      `}</style>

      <div className="min-h-screen bg-[#050508] text-white flex overflow-hidden font-sans relative selection:bg-indigo-500/30">
        
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 mix-blend-screen blur-[120px] opacity-60 animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/10 mix-blend-screen blur-[120px] opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-violet-600/10 mix-blend-screen blur-[140px] opacity-50 animate-blob animation-delay-4000" />
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        {/* --- STÂNGA: Prezentare (Desktop) --- */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 lg:p-20 relative z-10">
          {/* Header Brand */}
          <div className="relative z-20 animate-fade-in-up opacity-0" style={{ animationDelay: '100ms' }}>
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all duration-500 ring-1 ring-white/20">
                <span className="font-bold text-xl tracking-tight text-white drop-shadow-md">C</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
                ClaSerDent
              </span>
            </Link>
          </div>

          {/* Continut Principal */}
          <div className="relative z-20 mt-12 mb-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-medium text-indigo-200">Experiență Digitală Completă</span>
            </div>
            
            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.15] tracking-tight mb-6">
              Colaborare la <br />
              <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#93c5fd,45%,#e0e7ff,55%,#818cf8)] bg-[length:200%_auto] animate-text-shimmer drop-shadow-sm">
                standarde de excelență
              </span>
            </h1>
            <p className="text-lg xl:text-xl text-white/60 max-w-lg leading-relaxed font-light">
              Conectăm medicii stomatologi cu laboratoarele dentare pentru o eficiență maximă, transparență totală și lucrări impecabil executate.
            </p>
          </div>

          {/* Footer Brand */}
          <div className="relative z-20 opacity-0 animate-fade-in-up flex items-center gap-6" style={{ animationDelay: '500ms' }}>
            <p className="text-sm font-medium text-white/40">
              © {new Date().getFullYear()} ClaSerDent Technology Lab.
            </p>
            <div className="h-4 w-[1px] bg-white/10" />
            <Link href="/terms" className="text-sm text-white/40 hover:text-white/80 transition-colors">Termeni</Link>
            <Link href="/privacy" className="text-sm text-white/40 hover:text-white/80 transition-colors">Confidențialitate</Link>
          </div>
        </div>

        {/* --- DREAPTA: Formular Login --- */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
          
          {/* Card Principal de Login */}
          <div className={`w-full max-w-[440px] relative transition-transform duration-500 ${errorShake ? 'animate-shake' : ''}`}>
            
            {/* Header Mobile Brand */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-10 opacity-0 animate-fade-in-up">
              <div className="w-10 h-10 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] ring-1 ring-white/20">
                <span className="font-bold text-xl tracking-tight text-white">C</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white/90">
                ClaSerDent
              </span>
            </div>

            <div className="glass-panel p-8 sm:p-12 rounded-[2.5rem] opacity-0 animate-fade-in-up shadow-[0_0_40px_-10px_rgba(79,70,229,0.15)] relative overflow-hidden group" style={{ animationDelay: '200ms' }}>
              {/* Subtle top glow within card */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
              
              <div className="mb-10 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">Bine ai revenit</h2>
                <p className="text-indigo-200/60 text-sm font-medium">
                  Conectează-te la contul tău pentru a continua
                </p>
              </div>

              {/* Toggle User Type Premium */}
              <div className="flex p-1.5 rounded-2xl bg-black/40 shadow-inner border border-white/[0.05] mb-8 relative z-20">
                <div 
                  className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-b from-white/10 to-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) border border-white/[0.12]"
                  style={{ transform: userType === "medic" ? "translateX(0)" : "translateX(100%)" }}
                />
                <button 
                  type="button"
                  onClick={() => setUserType("medic")}
                  className={`relative flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 z-10 ${userType === "medic" ? "text-white" : "text-white/40 hover:text-white/70"}`}
                >
                  Sunt Medic
                </button>
                <button 
                  type="button"
                  onClick={() => setUserType("laborator")}
                  className={`relative flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 z-10 ${userType === "laborator" ? "text-white" : "text-white/40 hover:text-white/70"}`}
                >
                  Sunt Laborator
                </button>
              </div>

              {/* Formular login */}
              <form onSubmit={handleLogin} className="space-y-5 relative z-20">
                
                {/* Input Nume */}
                <div className="relative group rounded-2xl bg-white/[0.03] border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.05] focus-within:bg-white/[0.05] focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-5 pointer-events-none">
                    <User className="h-5 w-5 text-white/30 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all duration-300" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    required
                    className="peer block w-full h-[64px] bg-transparent pl-14 pr-5 pt-5 pb-1 text-[15px] font-medium text-white placeholder-transparent focus:outline-none"
                    placeholder="Nume"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-14 top-2 text-[10.5px] uppercase font-bold tracking-widest text-white/40 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10.5px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-indigo-400 pointer-events-none"
                  >
                    {userType === "medic" ? "Nume doctor" : "Nume laborator"}
                  </label>
                </div>

                {/* Input Email */}
                <div className="relative group rounded-2xl bg-white/[0.03] border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.05] focus-within:bg-white/[0.05] focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-5 pointer-events-none">
                    <Mail className="h-5 w-5 text-white/30 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all duration-300" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    className="peer block w-full h-[64px] bg-transparent pl-14 pr-5 pt-5 pb-1 text-[15px] font-medium text-white placeholder-transparent focus:outline-none"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-14 top-2 text-[10.5px] uppercase font-bold tracking-widest text-white/40 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10.5px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-indigo-400 pointer-events-none"
                  >
                    Adresa de email
                  </label>
                </div>

                {/* Input Parolă */}
                <div className="relative group rounded-2xl bg-white/[0.03] border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.05] focus-within:bg-white/[0.05] focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-5 pointer-events-none">
                    <Lock className="h-5 w-5 text-white/30 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all duration-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    className="peer block w-full h-[64px] bg-transparent pl-14 pr-16 pt-5 pb-1 text-[15px] font-medium text-white placeholder-transparent focus:outline-none"
                    placeholder="Parolă"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-14 top-2 text-[10.5px] uppercase font-bold tracking-widest text-white/40 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10.5px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-indigo-400 pointer-events-none"
                  >
                    Parolă
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors focus:outline-none p-1"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Options: Remember me & Forgot Password */}
                <div className="flex items-center justify-between pt-2 pb-6 text-sm">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 border border-white/20 rounded-md bg-white/5 group-hover:border-indigo-400 transition-colors shadow-inner">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <div className="w-3 h-3 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-[3px] scale-0 peer-checked:scale-100 transition-transform duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)" />
                    </div>
                    <span className="text-white/50 group-hover:text-white/90 transition-colors font-medium">
                      Ține-mă minte
                    </span>
                  </label>
                  
                  <Link 
                    href="/forgot-password" 
                    className="text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-4 transition-all font-medium"
                  >
                    Ai uitat parola?
                  </Link>
                </div>

                {/* Buton Submit Premium */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full rounded-2xl bg-gradient-to-b from-indigo-500 to-indigo-600 px-4 py-4 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_16px_rgba(79,70,229,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-300 hover:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_24px_rgba(79,70,229,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-[0_1px_1px_rgba(0,0,0,0.4),0_4px_8px_rgba(79,70,229,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)] disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:translate-y-0 disabled:shadow-none overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Shimmer sweep effect pe hover */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                  
                  <div className="relative flex items-center justify-center gap-2 drop-shadow-sm">
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

              {/* Link Creare Cont */}
              <div className="mt-10 text-center text-[15px] text-white/50 relative z-20">
                Nu ai un cont încă?{" "}
                <Link 
                  href="/register" 
                  className="text-white hover:text-indigo-400 font-semibold transition-colors hover:underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-400"
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
