import Link from "next/link";
import { ArrowRight, Activity, ShieldCheck, Microscope } from "lucide-react";

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-background">
      <div className="bg-hero-gradient absolute inset-0 -z-10" />

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-40 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <span className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-primary transition-colors">
              Platforma nr. 1 pentru laboratorul tău.{" "}
              <Link href="/register" className="font-semibold text-primary">
                <span className="absolute inset-0" aria-hidden="true" />
                Înscrie-te acum <span aria-hidden="true">&rarr;</span>
              </Link>
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
            Eficiență maximă pentru lucrările tale <span className="text-primary">protetice</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
            Conectează clinica stomatologică cu laboratorul de tehnică dentară. Gestionează comenzile, 
            urmărește statusul în timp real și transferă fișiere STL în siguranță.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-105"
            >
              Creează cont gratuit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/login" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
              Intră în cont <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-32">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col glass-card p-8 rounded-2xl">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                <Activity className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                Status în Timp Real
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                <p className="flex-auto">
                  Vezi imediat dacă lucrarea ta este la design, frezare sau dacă se îndreaptă spre clinică. Notificări instant.
                </p>
              </dd>
            </div>
            <div className="flex flex-col glass-card p-8 rounded-2xl">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                <ShieldCheck className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                Transfer Sigur (GDPR)
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                <p className="flex-auto">
                  Toate datele medicale, fișierele intraorale (.stl, .obj) și imaginile pacienților sunt stocate în mod complet securizat.
                </p>
              </dd>
            </div>
            <div className="flex flex-col glass-card p-8 rounded-2xl">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                <Microscope className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                Precizie Absolută
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                <p className="flex-auto">
                  Trimite instrucțiuni precise laboratorului prin diagrame dentare integrate și suport direct de mesagerie pe lucrare.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
