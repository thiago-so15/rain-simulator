import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lluvia App",
  description: "Aplicación creada con Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
