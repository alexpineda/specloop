/*
This client component provides the providers for the app.
*/

"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps
} from "next-themes"

export const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>{children}</TooltipProvider>
    </NextThemesProvider>
  )
}
