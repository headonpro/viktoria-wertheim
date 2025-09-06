import type { Metadata } from "next";
import { Geist, Geist_Mono, Goldman } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
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
  title: "SV Viktoria Wertheim - Offizielle Website",
  description: "Die offizielle Website des SV Viktoria Wertheim - Fußballverein seit 1921",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script defer data-domain="viktoria-wertheim.de" src="https://plausible.io/js/script.js"></script>
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
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}