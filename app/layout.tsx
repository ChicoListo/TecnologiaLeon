// app/layout.tsx (VERSIÓN FINAL)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/app/providers";
import { ThemeToggle } from "@/components/ThemeToggle"; // 1. Importamos el botón
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Gestión de Taller",
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
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* 2. Creamos un header simple para contener el botón */}
          <header className="border-b">
            <div className="container mx-auto flex h-16 items-center justify-between">
              <Link href="/" className="font-bold text-xl">
                TecnoLeón
              </Link>
              <ThemeToggle />
            </div>
          </header>

          {/* 3. El contenido principal de la página ahora va dentro de un <main> */}
          <main>
            {children}
          </main>

        </ThemeProvider>
      </body>
    </html>
  );
}