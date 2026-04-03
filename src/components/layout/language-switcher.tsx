"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LanguageSwitcher({ currentLoc }: { currentLoc: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSelectChange(nextLocale: string | null) {
    if (!nextLocale) return;
    startTransition(() => {
      Cookies.set("NEXT_LOCALE", nextLocale, { expires: 365, path: "/" });
      router.refresh();
    });
  }

  return (
    <Select
      defaultValue={currentLoc}
      onValueChange={onSelectChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[80px] h-9 border-none bg-transparent hover:bg-muted text-sm shadow-none focus:ring-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ro">RO 🇷🇴</SelectItem>
        <SelectItem value="en">EN 🇬🇧</SelectItem>
        <SelectItem value="de">DE 🇩🇪</SelectItem>
      </SelectContent>
    </Select>
  );
}
