"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles, Building2, Phone, ArrowRight } from "lucide-react";

export default function PremiumRegisterPage() {
  const router = useRouter();
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
  const [errorShake, setErrorShake] = useState(false);

  // Evitare hydration mismatch
  useEffect(() => setMounted(true), []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorShake(false);

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
        triggerErrorShake();
        return;
      }

      toast.success("Cont creat cu succes! Verifică emailul sau autentifică-te.", {
        icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      });
      
      router.push("/login");
      
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

        /* Ascundem scrollbar pt o integrare mai curata daca ecranul e mic */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="min-h-screen bg-[#050508] text-white flex overflow-hidden font-sans relative selection:bg-indigo-500/30">
        
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 mix-blend-screen blur-[120px] opacity-60 animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/10 mix-blend-screen blur-[120px] opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-violet-600/10 mix-blend-screen blur-[140px] opacity-50 animate-blob animation-delay-4000" />
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        {/* --- STÂNGA: Prezentare (Desktop) --- */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 lg:p-20 relative z-10">
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

          <div className="relative z-20 mt-12 mb-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-medium text-indigo-200">Progres Digital Rapid</span>
            </div>
            
            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.15] tracking-tight mb-6">
              Începe acum, <br />
              <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#93c5fd,45%,#e0e7ff,55%,#818cf8)] bg-[length:200%_auto] animate-text-shimmer drop-shadow-sm">
                fără complexități
              </span>
            </h1>
            <p className="text-lg xl:text-xl text-white/60 max-w-lg leading-relaxed font-light">
              Crezi un cont gratuit în mai puțin de un minut și intri direct în era digitală a ecosistemului dentar integrat.
            </p>
          </div>

          <div className="relative z-20 opacity-0 animate-fade-in-up flex items-center gap-6" style={{ animationDelay: '500ms' }}>
            <p className="text-sm font-medium text-white/40">
              © {new Date().getFullYear()} ClaSerDent Technology Lab.
            </p>
          </div>
        </div>

        {/* --- DREAPTA: Formular Inregistrare --- */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 h-screen overflow-y-auto no-scrollbar">
          
          <div className={`w-full max-w-[480px] relative transition-transform duration-500 my-auto py-10 ${errorShake ? 'animate-shake' : ''}`}>
            
            <div className="lg:hidden flex items-center justify-center gap-3 mb-10 opacity-0 animate-fade-in-up">
              <div className="w-10 h-10 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] ring-1 ring-white/20">
                <span className="font-bold text-xl tracking-tight text-white">C</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white/90">
                ClaSerDent
              </span>
            </div>

            <div className="glass-panel p-8 sm:p-10 rounded-[2.5rem] opacity-0 animate-fade-in-up shadow-[0_0_40px_-10px_rgba(79,70,229,0.15)] relative overflow-hidden group" style={{ animationDelay: '200ms' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
              
              <div className="mb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">Crează Cont Nou</h2>
                <p className="text-indigo-200/60 text-sm font-medium">
                  Completează datele pentru acces în platformă
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
                  onClick={() => setUserType("laborator_partener")}
                  className={`relative flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 z-10 ${userType === "laborator_partener" ? "text-white" : "text-white/40 hover:text-white/70"}`}
                >
                  Sunt Laborator
                </button>
              </div>

              {/* Formular Register */}
              <form onSubmit={handleRegister} className="space-y-4 relative z-20">
                
                {/* Nume Reprezentant */}
                <div className="relative group rounded-2xl bg-white/[0.03] border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.05] focus-within:bg-white/[0.05] focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-5 pointer-events-none">
                    <User className="h-5 w-5 text-white/30 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all duration-300" />
                  </div>
                  <input
                    type="text"
                    id="numeDoctor"
                    required
                    className="peer block w-full h-[60px] bg-transparent pl-14 pr-5 pt-5 pb-1 text-[15px] font-medium text-white placeholder-transparent focus:outline-none"
                    placeholder="Nume"
                    value={numeDoctor}
                    onChange={(e) => setNumeDoctor(e.target.value)}
                  />
                  <label htmlFor="numeDoctor" className="absolute left-14 top-2 text-[10px] uppercase font-bold tracking-widest text-white/40 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-indigo-400 pointer-events-none">
                    {userType === "medic" ? "Nume Doctor" : "Reprezentant Laborator"}
                  </label>
                </div>

                {/* Nume Clinica */}
                <div className="relative group rounded-2xl bg-white/[0.03] border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.05] focus-within:bg-white/[0.05] focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-5 pointer-events-none">
                    <Building2 className="h-5 w-5 text-white/30 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all duration-300" />
                  </div>
                  <input
                    type="text"
                    id="numeClinica"
                    className="peer block w-full h-[60px] bg-transparent pl-14 pr-5 pt-5 pb-1 text-[15px] font-medium text-white placeholder-transparent focus:outline-none"
                    placeholder="Clinică"
                    value={numeClinica}
                    onChange={(e) => setNumeClinica(e.target.value)}
                  />
                  <label htmlFor="numeClinica" className="absolute left-14 top-2 text-[10px] uppercase font-bold tracking-widest text-white/40 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-indigo-400 pointer-events-none">
                    {userType === "medic" ? "Nume Clinică (Opțional)" : "Nume Laborator"}
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Telefon */}
                  <div className="relative group rounded-2xl bg-white/[0.03] border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.05] focus-within:bg-white/[0.05] focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 pointer-events-none">
                      <Phone className="h-5 w-5 text-white/30 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all duration-300" />
                    </div>
                    <input
                      type="tel"
                      id="telefon"
                      className="peer block w-full h-[60px] bg-transparent pl-12 pr-4 pt-5 pb-1 text-[15px] font-medium text-white placeholder-transparent focus:outline-none"
                      placeholder="Telefon"
                      value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                      required
                    />
                    <label htmlFor="telefon" className="absolute left-12 top-2 text-[10px] uppercase font-bold tracking-widest text-white/40 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-indigo-400 pointer-events-none">
                      Telefon
                    </label>
                  </div>

                  {/* Email */}
                  <div className="relative group rounded-2xl bg-white/[0.03] border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.05] focus-within:bg-white/[0.05] focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 pointer-events-none">
                      <Mail className="h-5 w-5 text-white/30 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all duration-300" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      className="peer block w-full h-[60px] bg-transparent pl-12 pr-4 pt-5 pb-1 text-[15px] font-medium text-white placeholder-transparent focus:outline-none"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email" className="absolute left-12 top-2 text-[10px] uppercase font-bold tracking-widest text-white/40 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-indigo-400 pointer-events-none">
                      Email
                    </label>
                  </div>
                </div>

                {/* Parolă */}
                <div className="relative group rounded-2xl bg-white/[0.03] border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.05] focus-within:bg-white/[0.05] focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 overflow-hidden mt-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-5 pointer-events-none">
                    <Lock className="h-5 w-5 text-white/30 group-focus-within:text-indigo-400 group-focus-within:scale-110 transition-all duration-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    className="peer block w-full h-[60px] bg-transparent pl-14 pr-16 pt-5 pb-1 text-[15px] font-medium text-white placeholder-transparent focus:outline-none"
                    placeholder="Parolă"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-14 top-2 text-[10px] uppercase font-bold tracking-widest text-white/40 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-indigo-400 pointer-events-none"
                  >
                    Parolă (Min. 6 caractere)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors focus:outline-none p-1"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Buton Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 relative w-full rounded-2xl bg-gradient-to-b from-indigo-500 to-indigo-600 px-4 py-4 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_16px_rgba(79,70,229,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-300 hover:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_24px_rgba(79,70,229,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-[0_1px_1px_rgba(0,0,0,0.4),0_4px_8px_rgba(79,70,229,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)] disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:translate-y-0 disabled:shadow-none overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                  
                  <div className="relative flex items-center justify-center gap-2 drop-shadow-sm">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Se procesează...</span>
                      </>
                    ) : (
                      <>
                        <span>Crează Cont Acum</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
                
              </form>

              {/* Link Inapoi spre Login */}
              <div className="mt-8 text-center text-[15px] text-white/50 relative z-20">
                Ai deja un cont?{" "}
                <Link 
                  href="/login" 
                  className="text-white hover:text-indigo-400 font-semibold transition-colors hover:underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-400"
                >
                  Autentifică-te
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}
