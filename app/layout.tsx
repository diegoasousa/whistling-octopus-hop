import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/providers/providers';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { TestBanner } from '@/components/site/TestBanner';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { MetaPixel } from '@/components/analytics/MetaPixel';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: {
    default: 'Seoul Pulse - Produtos K-pop Oficiais',
    template: '%s | Seoul Pulse',
  },
  description: 'Lightsticks, photocards, álbuns e acessórios oficiais do universo K-pop. Envio internacional com taxas inclusas.',
  keywords: ['k-pop', 'lightstick', 'photocard', 'álbum', 'kpop', 'merchandise'],
  authors: [{ name: 'Seoul Pulse' }],
  creator: 'Seoul Pulse',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://seoulpulse.com.br',
    siteName: 'Seoul Pulse',
    title: 'Seoul Pulse - Produtos K-pop Oficiais',
    description: 'Lightsticks, photocards e acessórios oficiais do universo K-pop',
    images: [
      {
        url: '/seoul-pulse-logo.png',
        width: 1200,
        height: 630,
        alt: 'Seoul Pulse Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seoul Pulse - Produtos K-pop Oficiais',
    description: 'Lightsticks, photocards e acessórios oficiais',
    images: ['/seoul-pulse-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" style={{ colorScheme: 'dark' }}>
      <body>
        <GoogleAnalytics />
        <MetaPixel />
        <Providers>
          <TooltipProvider>
            <TestBanner />
            <div className="min-h-screen bg-background text-foreground">
              <Header />
              <main className="container py-8">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
