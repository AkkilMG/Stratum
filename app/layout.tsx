import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { withBasePath } from "@/lib/util";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://akkilmg.github.io/Stratum"),
  title: "Stratum Docs",
  description: "Official documentation for Stratum — local-first versioned searchable asset vault.",
  icons: {
    icon: withBasePath("/brand/favicon.png"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} antialiased`}> 
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
