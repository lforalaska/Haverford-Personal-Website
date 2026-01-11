import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Essays - Personal Writing',
    template: '%s | Essays',
  },
  description: 'A collection of essays on life, ideas, and experiences. Published weekly.',
  keywords: ['essays', 'writing', 'blog', 'personal'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    title: 'Essays - Personal Writing',
    description: 'A collection of essays on life, ideas, and experiences. Published weekly.',
    siteName: 'Essays',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essays - Personal Writing',
    description: 'A collection of essays on life, ideas, and experiences. Published weekly.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
