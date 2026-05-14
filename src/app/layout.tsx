import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import Nav from "@/components/layout/nav";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import PushSubscriptionManager from "@/components/layout/push-subscription-manager";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_LAB_NAME || "ClaSerDent Technology Lab"} | Portal`,
  description: "Aplicație B2B dedicată laboratoarelor de tehnică dentară",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  let messages = {};
  try {
    messages = await getMessages();
  } catch (err) {}

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-hero-gradient`}
      >
        <NextIntlClientProvider messages={messages}>
          <Nav />
          <main className="flex-1 w-full">{children}</main>
          <Toaster richColors closeButton />
          <PushSubscriptionManager />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
