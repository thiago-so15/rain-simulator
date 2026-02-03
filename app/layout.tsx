import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rain Simulator",
  description: "Aplicación creada con Next.js que simula lluvia y tiene varios parametros de configuracion.",
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
