"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/pages/layout/Provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const client = new QueryClient();

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
        <QueryClientProvider client={client}>
          <Provider>
            <Toaster />
            {children}
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
