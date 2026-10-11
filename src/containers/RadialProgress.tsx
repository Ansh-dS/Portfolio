'use client'

import React, { forwardRef, useMemo } from 'react'
import { cn } from '@/src/components/ui/Utils/utils'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'

// ============================================================================
// RadialProgress — Circular SVG progress indicator
// ============================================================================

export interface RadialProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value (0–max) */
  value: number
  /** Maximum value */
  max?: number
  /** Ring size in pixels */
  size?: number
  /** Ring stroke width in pixels */
  strokeWidth?: number
  /** Color variant for the progress arc */
  color?: 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
  /** Show value label in center */
  showLabel?: boolean
  /** Custom label (overrides default percentage) */
  label?: string
  /** Optional description under the value */
  description?: string
}

const colorMap = {
  brand: 'stroke-action-primary',
  accent: 'stroke-action-accent',
  success: 'stroke-status-success',
  warning: 'stroke-status-warning',
  danger: 'stroke-status-danger',
  info: 'stroke-status-info',
} as const

export const RadialProgress = forwardRef<HTMLDivElement, RadialProgressProps>(
  (
    {
      value,
      max = 100,
      size = 120,
      strokeWidth = 8,
      color = 'brand',
      showLabel = true,
      label,
      description,
      className,
      ...rest
    },
    ref
  ) => {
    const { circumference, offset, percentage } = useMemo(() => {
      const radius = (size - strokeWidth) / 2
      const circumference = 2 * Math.PI * radius
      const clampedValue = Math.max(0, Math.min(value, max))
      const percentage = Math.round((clampedValue / max) * 100)
      const offset = circumference - (clampedValue / max) * circumference
      return { circumference, offset, percentage }
    }, [value, max, size, strokeWidth])

    const center = size / 2
    const radius = (size - strokeWidth) / 2

    return (
      <Stack
        ref={ref}
        direction="vertical"
        gap="sm"
        align="center"
        className={className}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={description ?? `${percentage}% progress`}
        {...rest}
      >
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            className="-rotate-90"
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              className="stroke-surface-sunken"
              strokeWidth={strokeWidth}
            />
            {/* Progress arc */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              className={cn(colorMap[color], 'transition-all duration-slow')}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          {/* Center label */}
          {showLabel && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Text as="span" variant="h3" weight="bold" color="primary">
                {label ?? `${percentage}%`}
              </Text>
            </div>
          )}
        </div>
        {description && (
          <Text as="span" variant="caption" color="secondary" align="center">
            {description}
          </Text>
        )}
      </Stack>
    )
  }
)
RadialProgress.displayName = 'RadialProgress'

// ============================================================================
// ArcGauge — Semi-circular gauge for peak ratings (e.g., LeetCode)
// ============================================================================

export interface ArcGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value */
  value: number
  /** Min value */
  min?: number
  /** Max value */
  max?: number
  /** Gauge width in pixels */
  size?: number
  /** Arc stroke width */
  strokeWidth?: number
  /** Color variant */
  color?: 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
  /** Show value label */
  showLabel?: boolean
  /** Custom center label (overrides numeric value) */
  label?: string
  /** Description below the gauge */
  description?: string
  /** Min/max labels at the gauge ends */
  showRange?: boolean
}

export const ArcGauge = forwardRef<HTMLDivElement, ArcGaugeProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      size = 160,
      strokeWidth = 10,
      color = 'brand',
      showLabel = true,
      label,
      description,
      showRange = true,
      className,
      ...rest
    },
    ref
  ) => {
    const { arcPath, progressPath, displayValue } = useMemo(() => {
      const clamped = Math.max(min, Math.min(value, max))
      const ratio = (clamped - min) / (max - min)

      const cx = size / 2
      const cy = size / 2 + 10 // Shift down to account for semicircle
      const r = (size - strokeWidth) / 2 - 5

      // Arc from 180° to 0° (semicircle, left to right)
      const startAngle = Math.PI
      const endAngle = 0
      const progressAngle = startAngle - ratio * Math.PI

      const describeArc = (fromAngle: number, toAngle: number) => {
        const x1 = cx + r * Math.cos(fromAngle)
        const y1 = cy + r * Math.sin(fromAngle)
        const x2 = cx + r * Math.cos(toAngle)
        const y2 = cy + r * Math.sin(toAngle)
        const largeArc = Math.abs(fromAngle - toAngle) > Math.PI ? 1 : 0
        return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
      }

      return {
        arcPath: describeArc(startAngle, endAngle),
        progressPath: describeArc(startAngle, progressAngle),
        displayValue: Math.round(clamped),
      }
    }, [value, min, max, size, strokeWidth])

    const viewHeight = size / 2 + 30

    return (
      <Stack
        ref={ref}
        direction="vertical"
        gap="sm"
        align="center"
        className={className}
        role="meter"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={description ?? `Gauge: ${value}`}
        {...rest}
      >
        <div className="relative" style={{ width: size, height: viewHeight }}>
          <svg
            width={size}
            height={viewHeight}
            viewBox={`0 0 ${size} ${viewHeight}`}
          >
            {/* Background arc */}
            <path
              d={arcPath}
              fill="none"
              className="stroke-surface-sunken"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d={progressPath}
              fill="none"
              className={cn(colorMap[color], 'transition-all duration-slow')}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </svg>
          {/* Center value */}
          {showLabel && (
            <div
              className="absolute flex flex-col items-center"
              style={{
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <Text as="span" variant="h2" weight="bold" color="primary">
                {label ?? displayValue}
              </Text>
            </div>
          )}
        </div>

        {/* Range labels */}
        {showRange && (
          <Stack
            direction="horizontal"
            gap="none"
            justify="center"
            className="w-full"
            style={{ maxWidth: size }}
          >
            <Text as="span" variant="caption" color="secondary" className="flex-1 text-left">
              {min}
            </Text>
            <Text as="span" variant="caption" color="secondary" className="flex-1 text-right">
              {max}
            </Text>
          </Stack>
        )}

        {description && (
          <Text as="span" variant="caption" color="secondary" align="center">
            {description}
          </Text>
        )}
      </Stack>
    )
  }
)
ArcGauge.displayName = 'ArcGauge'
