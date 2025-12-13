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
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://drive.google.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
      </head>
      <body className="bg-[#efeee9] min-h-screen flex flex-col">
        <Providers>
          <Header />
          <DemoBanner />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl flex-1">
            <div className="rounded-3xl overflow-hidden">
              {children}
            </div>
          </main>
          <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mt-auto">
            <div className="border-t border-zinc-300 pt-6 pb-4">
              <p className="text-center text-xs text-zinc-500">
                © 2025 DESYNKART TECHNOLOGIES PRIVATE LIMITED
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
