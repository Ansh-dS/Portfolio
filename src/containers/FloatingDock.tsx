'use client'

import React, { forwardRef, useState, useCallback } from 'react'
import { cn } from '@/src/components/ui/Utils/utils'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { Tooltip } from '@/src/components/ui/Tooltip/Tooltip'

// ============================================================================
// FloatingDock — macOS-style dock with backdrop-blur and active tracking
// ============================================================================

export interface FloatingDockItem {
  /** Unique key */
  id: string
  /** Icon element (e.g., Lucide icon) */
  icon: React.ReactNode
  /** Label for tooltip */
  label: string
  /** Navigation target or click handler */
  href?: string
  onClick?: () => void
}

export interface FloatingDockProps extends React.HTMLAttributes<HTMLElement> {
  items: FloatingDockItem[]
  /** Currently active item ID */
  activeId?: string
  /** Position on screen */
  position?: 'bottom' | 'left' | 'right'
}

export const FloatingDock = forwardRef<HTMLElement, FloatingDockProps>(
  ({ items, activeId, position = 'bottom', className, ...rest }, ref) => {
    const isHorizontal = position === 'bottom'

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Floating dock"
        className={cn(
          'fixed z-[var(--z-index-nav)]',
          // Glassmorphism shell
          'bg-surface-base/70 backdrop-blur-md',
          'border border-border-default/50 shadow-overlay',
          'rounded-large',
          // Positioning
          isHorizontal && 'bottom-m left-1/2 -translate-x-1/2',
          position === 'left' && 'left-m top-1/2 -translate-y-1/2',
          position === 'right' && 'right-m top-1/2 -translate-y-1/2',
          className
        )}
        {...rest}
      >
        <Stack
          direction={isHorizontal ? 'horizontal' : 'vertical'}
          gap="none"
          align="center"
          className="p-xs"
        >
          {items.map((item) => {
            const isActive = activeId === item.id
            const Wrapper = item.href ? 'a' : 'button'
            const wrapperProps = item.href
              ? { href: item.href }
              : { type: 'button' as const, onClick: item.onClick }

            return (
              <Tooltip
                key={item.id}
                content={item.label}
                position={isHorizontal ? 'top' : 'right'}
              >
                <Wrapper
                  {...wrapperProps}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center justify-center',
                    'w-10 h-10 rounded-medium',
                    'transition-all duration-fast',
                    'text-fg-secondary hover:text-fg-primary',
                    'hover:bg-action-ghost-hover',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focused',
                    isActive && ['text-fg-brand bg-action-primary-subtle'],
                    // No border, no underline styling
                    'cursor-pointer border-0 bg-transparent no-underline'
                  )}
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    {item.icon}
                  </span>
                  {/* Active indicator dot */}
                  {isActive && (
                    <span
                      className={cn(
                        'absolute w-1 h-1 rounded-pill bg-fg-brand',
                        isHorizontal
                          ? '-bottom-0.5 left-1/2 -translate-x-1/2'
                          : '-right-0.5 top-1/2 -translate-y-1/2'
                      )}
                    />
                  )}
                </Wrapper>
              </Tooltip>
            )
          })}
        </Stack>
      </nav>
    )
  }
)
FloatingDock.displayName = 'FloatingDock'

// ============================================================================
// FloatingNav — Sticky top bar with backdrop-blur and scroll-spy active state
// ============================================================================

export interface FloatingNavItem {
  /** Unique key matching a section ID */
  id: string
  /** Display label */
  label: string
  /** Navigation target */
  href: string
}

export interface FloatingNavProps extends React.HTMLAttributes<HTMLElement> {
  items: FloatingNavItem[]
  /** Currently active item ID (driven by useScrollSpy) */
  activeId?: string
  /** Left-side branding slot */
  brand?: React.ReactNode
}

export const FloatingNav = forwardRef<HTMLElement, FloatingNavProps>(
  ({ items, activeId, brand, className, ...rest }, ref) => {
    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          'fixed top-m left-1/2 -translate-x-1/2 z-[var(--z-index-nav)]',
          'bg-surface-base/70 backdrop-blur-md',
          'border border-border-default/50 shadow-overlay',
          'rounded-large px-s py-xs',
          'max-w-3xl w-[90vw]',
          className
        )}
        {...rest}
      >
        <Stack direction="horizontal" gap="sm" align="center" justify="center">
          {brand && <div className="mr-m shrink-0">{brand}</div>}
          {items.map((item) => {
            const isActive = activeId === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative px-s py-xs rounded-medium',
                  'transition-all duration-fast',
                  'text-fg-secondary hover:text-fg-primary',
                  'hover:bg-action-ghost-hover',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focused',
                  'no-underline',
                  isActive && 'text-fg-brand bg-action-primary-subtle'
                )}
              >
                <Text
                  as="span"
                  variant="label"
                  weight={isActive ? 'semibold' : 'medium'}
                  color={isActive ? 'brand' : 'secondary'}
                >
                  {item.label}
                </Text>
              </a>
            )
          })}
        </Stack>
      </nav>
    )
  }
)
FloatingNav.displayName = 'FloatingNav'
