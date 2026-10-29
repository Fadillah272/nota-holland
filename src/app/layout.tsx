import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Receipt Generator - Pembuat Struk Belanja Toko Roti',
  description:
    'Aplikasi web untuk membuat dan mencetak struk belanja toko roti/bakery ke printer thermal 58mm & 80mm.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
