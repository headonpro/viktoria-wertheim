import type { Metadata } from "next";
import { Geist, Geist_Mono, Goldman } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const goldman = Goldman({
  weight: ["400", "700"],
  variable: "--font-goldman",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://viktoria.headon.pro'
  ),
  title: "SV Viktoria Wertheim - Offizielle Website",
  description: "Die offizielle Website des SV Viktoria Wertheim - Fußballverein seit 1921",
  openGraph: {
    title: "SV Viktoria Wertheim",
    description: "Die offizielle Website des SV Viktoria Wertheim - Fußballverein seit 1921",
    url: 'https://viktoria.headon.pro',
    siteName: 'SV Viktoria Wertheim',
    images: [
      {
        url: '/viktorialogo.png',
        width: 800,
        height: 600,
        alt: 'SV Viktoria Wertheim Logo',
      }
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SV Viktoria Wertheim',
    description: 'Die offizielle Website des SV Viktoria Wertheim - Fußballverein seit 1921',
    images: ['/viktorialogo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Preload critical images for better LCP */}
        <link rel="preload" as="image" href="/optimized/viktorialogo-48w.webp" type="image/webp" />
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://plausible.io" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script defer data-domain="viktoria.headon.pro" src="https://plausible.io/js/script.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${goldman.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}