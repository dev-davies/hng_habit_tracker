import type { Metadata } from "next";
import ServiceWorkerRegistrar from "@/components/shared/ServiceWorkerRegistrar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "A PWA habit tracker built for daily consistency.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50 transition-colors duration-300">
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
