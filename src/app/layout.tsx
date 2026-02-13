import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import { getConfig } from '@/lib/config';

const config = getConfig();

export const metadata: Metadata = {
  title: {
    default: `${config.name} Help Center`,
    template: `%s | ${config.name} Help`,
  },
  description: `Find answers, guides, and product updates for ${config.name}.`,
  openGraph: {
    title: `${config.name} Help Center`,
    description: `Find answers, guides, and product updates for ${config.name}.`,
    images: [{ url: '/og-image.png', width: 1456, height: 816 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.name} Help Center`,
    description: `Find answers, guides, and product updates for ${config.name}.`,
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const colorStyle = {
    '--color-primary': config.colors.primary,
  } as React.CSSProperties;

  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col" style={colorStyle}>
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-8 mt-12">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
            <p>&copy; {new Date().getFullYear()} {config.name}. All rights reserved.</p>
            <div className="flex gap-6">
              <a href={config.productUrl} className="hover:text-text transition-colors">
                {config.name}
              </a>
              {config.footer.termsUrl && (
                <a href={config.footer.termsUrl} className="hover:text-text transition-colors">
                  Terms
                </a>
              )}
              {config.footer.privacyUrl && (
                <a href={config.footer.privacyUrl} className="hover:text-text transition-colors">
                  Privacy
                </a>
              )}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
