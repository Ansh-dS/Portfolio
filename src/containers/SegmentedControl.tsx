'use client'

import React, { forwardRef, useState, useCallback } from 'react'
import { motion, type MotionProps } from 'framer-motion'
import { cn } from '@/src/components/ui/Utils/utils'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'

// ============================================================================
// SegmentedControl — Framer Motion layoutId shared-background tabs
// ============================================================================

export interface SegmentedControlItem {
  /** Unique value for this segment */
  value: string
  /** Display label */
  label: string
  /** Optional icon element */
  icon?: React.ReactNode
  /** Disable this segment */
  disabled?: boolean
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: SegmentedControlItem[]
  /** Controlled value */
  value?: string
  /** Default value for uncontrolled mode */
  defaultValue?: string
  /** Callback when selection changes */
  onChange?: (value: string) => void
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Unique layoutId prefix to prevent conflicts with multiple instances */
  layoutId?: string
}

const sizeMap = {
  sm: { container: 'p-0.5 rounded-small', tab: 'px-s py-xs', text: 'caption' as const },
  md: { container: 'p-0.5 rounded-medium', tab: 'px-m py-xs', text: 'label' as const },
  lg: { container: 'p-1 rounded-medium', tab: 'px-l py-s', text: 'body' as const },
} as const

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      items,
      value: controlledValue,
      defaultValue,
      onChange,
      size = 'md',
      layoutId = 'segmented',
      className,
      ...rest
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      defaultValue ?? items[0]?.value ?? ''
    )
    const activeValue =
      controlledValue !== undefined ? controlledValue : internalValue

    const handleSelect = useCallback(
      (val: string) => {
        if (controlledValue === undefined) setInternalValue(val)
        onChange?.(val)
      },
      [controlledValue, onChange]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, index: number) => {
        const enabledItems = items.filter((i) => !i.disabled)
        const currentEnabled = enabledItems.findIndex(
          (i) => i.value === items[index].value
        )

        let target: number | null = null

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault()
          target = (currentEnabled + 1) % enabledItems.length
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          target =
            (currentEnabled - 1 + enabledItems.length) % enabledItems.length
        }

        if (target !== null) {
          handleSelect(enabledItems[target].value)
          // Focus the target button
          const container = e.currentTarget.closest('[role="tablist"]')
          const buttons = container?.querySelectorAll<HTMLButtonElement>(
            'button:not([disabled])'
          )
          buttons?.[target]?.focus()
        }
      },
      [items, handleSelect]
    )

    const styles = sizeMap[size]

    return (
      <div
        ref={ref}
        role="tablist"
        aria-label="Segmented control"
        className={cn(
          'inline-flex bg-surface-sunken border border-border-default',
          styles.container,
          className
        )}
        {...rest}
      >
        {items.map((item, index) => {
          const isActive = activeValue === item.value
          return (
            <button
              key={item.value}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-disabled={item.disabled}
              disabled={item.disabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => !item.disabled && handleSelect(item.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'relative flex items-center justify-center gap-xs',
                styles.tab,
                'rounded-small cursor-pointer',
                'transition-colors duration-fast',
                'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focused',
                'z-[1]', // Above the background slider
                item.disabled && 'opacity-40 cursor-not-allowed',
                !isActive && !item.disabled && 'hover:text-fg-primary',
              )}
            >
              {/* Framer Motion shared layout background */}
              {isActive && (
                <motion.span
                  layoutId={`${layoutId}-indicator`}
                  className="absolute inset-0 bg-surface-base border border-border-default shadow-raised rounded-small"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-[1] flex items-center gap-xs">
                {item.icon && (
                  <span className="w-4 h-4 flex items-center justify-center shrink-0">
                    {item.icon}
                  </span>
                )}
                <Text
                  as="span"
                  variant={styles.text}
                  weight={isActive ? 'semibold' : 'medium'}
                  color={isActive ? 'primary' : 'secondary'}
                >
                  {item.label}
                </Text>
              </span>
            </button>
          )
        })}
      </div>
    )
  }
)
SegmentedControl.displayName = 'SegmentedControl'

// ============================================================================
// AnimatedTabIndicator — Underline-style tab bar with Framer Motion layoutId
// ============================================================================

export interface TabItem {
  /** Unique value */
  value: string
  /** Display label */
  label: string
  /** Optional icon */
  icon?: React.ReactNode
}

export interface AnimatedTabIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[]
  /** Currently active tab value */
  value?: string
  /** Default for uncontrolled mode */
  defaultValue?: string
  /** Callback */
  onChange?: (value: string) => void
  /** Unique layoutId prefix */
  layoutId?: string
}

export const AnimatedTabIndicator = forwardRef<
  HTMLDivElement,
  AnimatedTabIndicatorProps
>(
  (
    {
      tabs,
      value: controlledValue,
      defaultValue,
      onChange,
      layoutId = 'tab-indicator',
      className,
      ...rest
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      defaultValue ?? tabs[0]?.value ?? ''
    )
    const activeValue =
      controlledValue !== undefined ? controlledValue : internalValue

    const handleSelect = useCallback(
      (val: string) => {
        if (controlledValue === undefined) setInternalValue(val)
        onChange?.(val)
      },
      [controlledValue, onChange]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, index: number) => {
        let target: number | null = null

        if (e.key === 'ArrowRight') {
          e.preventDefault()
          target = (index + 1) % tabs.length
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          target = (index - 1 + tabs.length) % tabs.length
        }

        if (target !== null) {
          handleSelect(tabs[target].value)
          const container = e.currentTarget.closest('[role="tablist"]')
          const buttons =
            container?.querySelectorAll<HTMLButtonElement>('button')
          buttons?.[target]?.focus()
        }
      },
      [tabs, handleSelect]
    )

    return (
      <div
        ref={ref}
        role="tablist"
        aria-label="Tab navigation"
        className={cn(
          'flex border-b border-border-default',
          className
        )}
        {...rest}
      >
        {tabs.map((tab, index) => {
          const isActive = activeValue === tab.value
          return (
            <button
              key={tab.value}
              role="tab"
              type="button"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(tab.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'relative px-m py-s cursor-pointer',
                'transition-colors duration-fast',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focused',
                'bg-transparent border-0',
                isActive
                  ? 'text-fg-brand'
                  : 'text-fg-secondary hover:text-fg-primary',
              )}
            >
              <Stack direction="horizontal" gap="sm" align="center">
                {tab.icon && (
                  <span className="w-4 h-4 flex items-center justify-center">
                    {tab.icon}
                  </span>
                )}
                <Text
                  as="span"
                  variant="label"
                  weight={isActive ? 'semibold' : 'medium'}
                  color={isActive ? 'brand' : 'secondary'}
                >
                  {tab.label}
                </Text>
              </Stack>
              {/* Animated underline */}
              {isActive && (
                <motion.span
                  layoutId={`${layoutId}-underline`}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-fg-brand"
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    )
  }
)
AnimatedTabIndicator.displayName = 'AnimatedTabIndicator'
