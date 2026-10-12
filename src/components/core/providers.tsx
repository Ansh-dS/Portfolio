'use client'

import React from 'react'
import { ThemeProvider } from './theme-provider'
import { ToastProvider } from '../ui/ToastProvider/ToastProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="portfolio" defaultMode="light">
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}
