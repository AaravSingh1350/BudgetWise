import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import StoreProvider from './store-provider';
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: 'BudgetWise',
  description: 'Track your expenses and manage your budget with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3703887186622638" crossOrigin="anonymous"></script>
      </head>
      <body className="font-body antialiased h-full">
        <StoreProvider>
          {children}
        </StoreProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
