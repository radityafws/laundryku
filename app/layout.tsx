import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LaundryKilat - Layanan Laundry Kiloan Terbaik di Solo',
  description: 'Layanan laundry kiloan dan express terpercaya di Solo. Harga mulai Rp 3.000/kg, layanan 1 hari selesai. Antar jemput gratis!',
  keywords: 'laundry solo, laundry kiloan, laundry express, laundry murah, laundry UNS',
  authors: [{ name: 'LaundryKilat' }],
  openGraph: {
    title: 'LaundryKilat - Layanan Laundry Kiloan Terbaik di Solo',
    description: 'Layanan laundry kiloan dan express terpercaya di Solo. Harga mulai Rp 3.000/kg, layanan 1 hari selesai.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}