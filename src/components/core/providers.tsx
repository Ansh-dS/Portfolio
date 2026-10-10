'use client'

import React from 'react'
import { ThemeProvider } from './theme-provider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="portfolio" defaultMode="light">
      {/* <ToastProvider> can be added here later */}
      {children}
    </ThemeProvider>
  )
}