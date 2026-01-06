// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from './providers';
import Header from "@/components/Header";

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
      <body className="bg-[#efeee9]">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K1TMVXP5PX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K1TMVXP5PX');
          `}
        </Script>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl flex-1">
              <div className="rounded-3xl overflow-hidden">
                {children}
              </div>
            </main>
            <footer className="bg-white border-t border-zinc-300 mt-8">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl">
                <p className="text-center text-xs text-zinc-600 font-medium">
                  © 2025 DESYNKART TECHNOLOGIES PRIVATE LIMITED
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
