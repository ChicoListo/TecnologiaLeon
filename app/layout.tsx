// app/layout.tsx (CÓDIGO FINAL Y CORREGIDO)
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. Importamos la fuente estándar 'Inter'
import "./globals.css";
import { cn } from "@/lib/utils";

// 2. Configuramos la fuente 'Inter'
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Gestión de Taller", // Puedes cambiar el título de tu app aquí
  description: "Sistema de gestión de órdenes para taller de reparaciones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // 3. Aplicamos la fuente 'Inter' al cuerpo de la aplicación
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}