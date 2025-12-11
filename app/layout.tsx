import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'EcoRide | Premium Eco-Friendly Car Rental',
  description: 'Book electric and hybrid vehicles instantly. Premium insurance included. 99% satisfaction rate.',
  keywords: 'car rental, electric vehicles, eco-friendly, sustainable',
  openGraph: {
    title: 'EcoRide - Drive Green, Live Better',
    description: 'Premium eco-friendly car rental service with 50K+ happy customers',
    url: 'https://www.nationfirstchoice.com/',
    type: 'website',
    // images: [
    //   {
    //     url: 'https://ecoride.com/og-image.jpg',
    //     width: 1200,
    //     height: 630,
    //     alt: 'EcoRide Premium Eco-Friendly Car Rental',
    //   },
    // ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
