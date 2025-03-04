import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Screensaver",
  description: "Screensaver",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-hidden`}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {children}
      </body>
    </html>
  );
}
