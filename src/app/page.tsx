import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Activity, ShieldCheck, Microscope } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <div className="relative isolate min-h-[calc(100vh-5rem)] xl:h-[calc(100vh-5rem)] overflow-hidden bg-background flex flex-col justify-center py-10">
      <div className="bg-hero-gradient absolute inset-0 -z-10" />

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
              {t("title1")} <span className="text-primary">{t("title2")}</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground text-balance">
              {t("desc")}
            </p>
            <div className="mt-8 flex items-center justify-start gap-x-6">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-105"
              >
                {t("createAccountBtn")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/login" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
                {t("loginBtn")} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none transform transition-transform hover:scale-105 duration-700">
            <Image
              src="/hero-image.png"
              alt="Dental Lab Platform"
              width={800}
              height={600}
              className="w-full object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12 lg:mt-16 w-full">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-6 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col glass-card p-6 lg:p-8 rounded-2xl">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                <Activity className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                {t("f1Title")}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                <p className="flex-auto">
                  {t("f1Desc")}
                </p>
              </dd>
            </div>
            <div className="flex flex-col glass-card p-6 lg:p-8 rounded-2xl">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                <ShieldCheck className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                {t("f2Title")}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                <p className="flex-auto">
                  {t("f2Desc")}
                </p>
              </dd>
            </div>
            <div className="flex flex-col glass-card p-6 lg:p-8 rounded-2xl">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                <Microscope className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                {t("f3Title")}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                <p className="flex-auto">
                  {t("f3Desc")}
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
