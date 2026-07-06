import type { Metadata, Viewport } from "next";
import "./globals.css";

const rutaBase = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "LaundryOS Pro",
  description: "Plataforma SaaS internacional para administración de lavanderías de autoservicio.",
  manifest: `${rutaBase}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LaundryOS Pro"
  },
  icons: {
    icon: `${rutaBase}/icono.svg`,
    apple: `${rutaBase}/icono-apple.svg`
  }
};

export const viewport: Viewport = {
  themeColor: "#0E6F8F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover"
};

export default function DisenoRaiz({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
