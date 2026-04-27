import type { Metadata } from "next";
import ServiceWorkerRegistrar from "@/components/shared/ServiceWorkerRegistrar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "A PWA habit tracker built for daily consistency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
