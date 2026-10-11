import React, { useId } from 'react'
import { cn } from '../Utils/utils'

export interface DotPatternProps extends React.SVGAttributes<SVGSVGElement> {
  /** Width of each pattern tile in pixels (grid spacing). Default: 28 */
  width?: number
  /** Height of each pattern tile in pixels (grid spacing). Default: 28 */
  height?: number
  /** X offset of the dot center inside each tile. Default: 1.5 */
  cx?: number
  /** Y offset of the dot center inside each tile. Default: 1.5 */
  cy?: number
  /** Radius of each dot in pixels. Default: 1.5 */
  cr?: number
  /** Enable radial vignette fadeout towards edges for comfortable reading. Default: true */
  fade?: boolean
  /** Custom fill color using tokens from global.css. Default: fill-fg-secondary/50 */
  dotClassName?: string
}

/**
 * DotPattern Component
 *
 * Highly performant SVG background pattern that tiles a single vector dot on the GPU.
 * Uses tokens strictly from src/components/core/styles/global.css (--color-fg-secondary / --color-fg-primary).
 */
export function DotPattern({
  width = 28,
  height = 28,
  cx = 1.5,
  cy = 1.5,
  cr = 1.5,
  fade = true,
  dotClassName,
  className,
  ...props
}: DotPatternProps): React.ReactElement {
  const id = useId()

  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed inset-0 h-full w-full',
        fade &&
          '[mask-image:radial-gradient(ellipse_85%_85%_at_50%_40%,#000_70%,transparent_100%)]',
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={0}
          y={0}
        >
          <circle
            cx={cx}
            cy={cy}
            r={cr}
            className={cn(
              'fill-fg-secondary/50 dark:fill-fg-secondary/50',
              dotClassName
            )}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  )
}
