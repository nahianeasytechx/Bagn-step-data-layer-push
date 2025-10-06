import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import ClientLayout from "@/components/ClientLayout";
import { Lato } from 'next/font/google'
import { SpeedInsights } from "@vercel/speed-insights/next"

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased lato.classname`}>
        <CartProvider>
          <ClientLayout>{children}</ClientLayout>
           <SpeedInsights />
        </CartProvider>
      </body>
    </html>
  );
}
