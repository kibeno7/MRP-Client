import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RecoilContextProvider from "@/lib/RecoilContextProvider";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MRP | MCA Records on Placements",
  description: "Triumph over your interview by reading the experiences of others.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RecoilContextProvider>
          <Toaster position="bottom-right" />
          {children}
        </RecoilContextProvider>
      </body>
    </html>
  );
}
