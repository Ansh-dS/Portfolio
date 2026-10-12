'use client'

import React, { forwardRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/src/components/ui/Utils/utils'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { useTheme } from '@/src/components/ui/../core/theme-provider'

// ============================================================================
// ThemeToggle — Sun/Moon switch mapped to CSS variable mode
// ============================================================================

export interface ThemeToggleProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> {
  /** Size of the toggle */
  size?: 'sm' | 'md' | 'lg'
  /** Optional callback when mode changes */
  onChange?: (mode: string) => void
}

const sizeMap = {
  sm: { button: 'w-8 h-8', icon: 16 },
  md: { button: 'w-10 h-10', icon: 20 },
  lg: { button: 'w-12 h-12', icon: 24 },
} as const

// Sun icon (inline SVG to avoid icon library dependency)
const SunIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

// Moon icon
const MoonIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ size = 'md', onChange, className, ...rest }, ref) => {
    const { mode, setMode } = useTheme()
    const isDark = mode === 'dark'
    const styles = sizeMap[size]

    const handleToggle = useCallback(() => {
      const next = isDark ? 'light' : 'dark'
      setMode(next)
      onChange?.(next)
    }, [isDark, setMode, onChange])

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        onClick={handleToggle}
        className={cn(
          'relative flex items-center justify-center',
          styles.button,
          'rounded-medium cursor-pointer',
          'bg-transparent border-0',
          'text-fg-secondary hover:text-fg-primary',
          'hover:bg-action-ghost-hover',
          'transition-all duration-fast',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focused',
          className
        )}
        {...rest}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <MoonIcon size={styles.icon} />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <SunIcon size={styles.icon} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    )
  }
)
ThemeToggle.displayName = 'ThemeToggle'
