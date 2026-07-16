import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';
import { ToastMessage } from '@/components/ui/toast-message';
import { AppProviders } from './providers';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="bg-background text-foreground min-h-full">
        <AppProviders>
          <Suspense>{children}</Suspense>
          <ToastMessage />
        </AppProviders>
      </body>
    </html>
  );
}
