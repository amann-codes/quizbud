"use client"

import { Geist_Mono, Jost } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/pages/layout/Provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const funnelDisplay = Jost({
  variable: "--font-funnel-display",
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
        className={`${funnelDisplay.variable} ${geistMono.variable} select-none antialiased`}
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
