import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import ClientLayout from "@/components/ClientLayout";
import { Lato } from 'next/font/google'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script";

const lato = Lato({
  subsets: ['latin'], 
  weight: ['400', '700'], // 400 = normal, 700 = bold
  display: 'swap', // for better UX
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BAGNSTEP",
  description: "Best shoes and bags online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MT4Q8XHR');`
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased ${lato.className}`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MT4Q8XHR"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <CartProvider>
          <ClientLayout>{children}</ClientLayout>
          <SpeedInsights />
        </CartProvider>
      </body>
    </html>
  );
}