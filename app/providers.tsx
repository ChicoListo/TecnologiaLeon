// app/providers.tsx (CÓDIGO CORREGIDO Y SIMPLIFICADO)
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Ya no necesitamos importar ThemeProviderProps

// Simplificamos la definición de las props
export function ThemeProvider({ children, ...props }: { children: React.ReactNode;[key: string]: any }) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}