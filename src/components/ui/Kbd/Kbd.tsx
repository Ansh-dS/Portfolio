import React, { forwardRef } from 'react'
import { cn } from '../Utils/utils'

export type KbdProps = React.HTMLAttributes<HTMLElement> & {
  size?: 'sm' | 'md'
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ className, children, size = 'md', ...rest }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-mono bg-surface-sunken border border-border-default border-b-2 border-b-border-strong rounded-small shadow-raised text-fg-secondary px-1 py-px text-caption min-w-[20px] h-5 select-none',
          size === 'sm' && 'text-[10px] h-4 min-w-[16px] px-0.5',
          className
        )}
        {...rest}
      >
        {children}
      </kbd>
    )
  }
)

Kbd.displayName = 'Kbd'
