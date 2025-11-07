// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from './providers';
import Header from "@/components/Header";
import DemoBanner from "@/components/DemoBanner";

export const metadata: Metadata = {
  title: "Design&Cart",
  description: "Designers collaborate, approve renders, and shop products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#efeee9]">
        <Providers>
          <Header />
          <DemoBanner />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
            <div className="rounded-3xl overflow-hidden">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
