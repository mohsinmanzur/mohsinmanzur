import type { Metadata, Viewport } from "next";
import StoreProvider from "@/providers/StoreProvider";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Portfolio | Personal Portfolio & Showcase",
    template: "%s | Portfolio",
  },
  description: "Modern personal portfolio showcasing projects, experience, technical skills, and achievements.",
  keywords: ["Portfolio", "Developer", "Software Engineer", "Full Stack", "Projects"],
  authors: [{ name: "Developer" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Portfolio",
    title: "Portfolio | Personal Portfolio & Showcase",
    description: "Modern personal portfolio showcasing projects, experience, and technical skills.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
