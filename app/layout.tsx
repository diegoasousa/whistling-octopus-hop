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
    default: 'Seoul Beat - Produtos K-pop Oficiais',
    template: '%s | Seoul Beat',
  },
  description: 'Lightsticks, photocards, álbuns e acessórios oficiais do universo K-pop. Envio internacional com taxas inclusas.',
  keywords: ['k-pop', 'lightstick', 'photocard', 'álbum', 'kpop', 'merchandise'],
  authors: [{ name: 'Seoul Beat' }],
  creator: 'Seoul Beat',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://seoulbeat.com.br',
    siteName: 'Seoul Beat',
    title: 'Seoul Beat - Produtos K-pop Oficiais',
    description: 'Lightsticks, photocards e acessórios oficiais do universo K-pop',
    images: [
      {
        url: '/seoul-beat-logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Seoul Beat Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seoul Beat - Produtos K-pop Oficiais',
    description: 'Lightsticks, photocards e acessórios oficiais',
    images: ['/seoul-beat-logo.jpeg'],
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
