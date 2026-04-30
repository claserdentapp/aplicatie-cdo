"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide on main landing page or core routes where back might not make sense
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <button
      onClick={() => router.back()}
      className="mr-2 p-2 md:mr-4 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-primary" />
    </button>
  );
}
