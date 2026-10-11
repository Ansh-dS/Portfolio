'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/src/components/ui/Utils/utils'
import { Box } from '@/src/components/ui/Box/Box'

// ============================================================================
// BentoGrid — CSS Grid-based layout for metrics & feature showcases
// ============================================================================

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns at desktop breakpoint */
  columns?: 2 | 3 | 4
  /** Gap between grid items */
  gap?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const columnMap = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
} as const

const gapMap = {
  sm: 'gap-s',
  md: 'gap-m',
  lg: 'gap-l',
} as const

export const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(
  ({ columns = 3, gap = 'md', className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid grid-cols-1',
          columnMap[columns],
          gapMap[gap],
          'auto-rows-[minmax(180px,auto)]',
          className
        )}
        {...rest}
      >
        {children}
      </div>
    )
  }
)
BentoGrid.displayName = 'BentoGrid'

// ─── BentoCard (Grid child) ─────────────────────────────────────────────────

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Span columns (1 = normal, 2 = wide) */
  colSpan?: 1 | 2
  /** Span rows (1 = normal, 2 = tall) */
  rowSpan?: 1 | 2
  /** Visual variant */
  variant?: 'default' | 'glass' | 'highlighted'
  children: React.ReactNode
}

const colSpanMap = {
  1: 'col-span-1',
  2: 'md:col-span-2',
} as const

const rowSpanMap = {
  1: 'row-span-1',
  2: 'row-span-2',
} as const

export const BentoCard = forwardRef<HTMLDivElement, BentoCardProps>(
  (
    {
      colSpan = 1,
      rowSpan = 1,
      variant = 'default',
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <Box
        ref={ref}
        className={cn(
          colSpanMap[colSpan],
          rowSpanMap[rowSpan],
          'p-l overflow-hidden',
          'transition-all duration-normal ease-out',
          'hover:shadow-overlay hover:-translate-y-0.5',
          // Variant overrides
          variant === 'glass' && [
            'bg-surface-base/40 backdrop-blur-md',
            'border-white/10 shadow-modal',
          ],
          variant === 'highlighted' && [
            'bg-action-primary text-fg-inverted',
            'border-transparent shadow-overlay',
          ],
          className
        )}
        {...rest}
      >
        {children}
      </Box>
    )
  }
)
BentoCard.displayName = 'BentoCard'
