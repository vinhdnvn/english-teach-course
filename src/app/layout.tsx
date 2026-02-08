import type { Metadata } from "next";
import { Lexend, Dancing_Script } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-lexend",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: "Alex Smart AI - English Learning for Grade 5",
  description: "Interactive English learning app with AI for Vietnamese students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexend.variable} ${dancingScript.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
