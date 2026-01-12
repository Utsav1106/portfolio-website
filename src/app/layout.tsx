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
  title: "Utsav Saini - Portfolio",
  description: "Building the next generation of web applications. I architect full-stack solutions with a passion for integrating cutting-edge AI and Web3 technologies to solve complex challenges.",
  icons: "/logo.png",
  openGraph: {
    title: "Utsav Saini - Portfolio",
    description: "Building the next generation of web applications. I architect full-stack solutions with a passion for integrating cutting-edge AI and Web3 technologies to solve complex challenges.",
    url: "https://utsavsaini.vercel.app",
    images: "/logo.png",
  }
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white dark:bg-black antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
