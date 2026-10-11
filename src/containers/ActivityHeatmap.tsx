'use client'

import React, { forwardRef, useMemo } from 'react'
import { cn } from '@/src/components/ui/Utils/utils'
import { Box } from '@/src/components/ui/Box/Box'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { Tooltip } from '@/src/components/ui/Tooltip/Tooltip'

// ============================================================================
// ActivityHeatmap — GitHub-style contribution grid (SVG-based)
// ============================================================================

export interface HeatmapData {
  /** ISO date string (YYYY-MM-DD) */
  date: string
  /** Activity count */
  count: number
}

export interface ActivityHeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of { date, count } entries */
  data: HeatmapData[]
  /** Number of weeks to display (default 52 = full year) */
  weeks?: number
  /** Color intensity levels (maps count ranges to opacity/color) */
  colorLevels?: number
  /** Cell size in pixels */
  cellSize?: number
  /** Gap between cells in pixels */
  cellGap?: number
  /** Label for the metric (e.g., "contributions") */
  metricLabel?: string
}

const DAYS_IN_WEEK = 7
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

function getIntensityLevel(
  count: number,
  maxCount: number,
  levels: number
): number {
  if (count === 0) return 0
  if (maxCount === 0) return 0
  const ratio = count / maxCount
  return Math.min(Math.ceil(ratio * levels), levels)
}

// Maps intensity level → Tailwind color classes using design tokens
const intensityColors: Record<number, string> = {
  0: 'fill-surface-sunken',
  1: 'fill-action-primary-subtle',
  2: 'fill-action-primary/40',
  3: 'fill-action-primary/65',
  4: 'fill-action-primary',
}

export const ActivityHeatmap = forwardRef<HTMLDivElement, ActivityHeatmapProps>(
  (
    {
      data,
      weeks = 52,
      colorLevels = 4,
      cellSize = 12,
      cellGap = 3,
      metricLabel = 'contributions',
      className,
      ...rest
    },
    ref
  ) => {
    const { grid, maxCount, totalCount } = useMemo(() => {
      const dataMap = new Map(data.map((d) => [d.date, d.count]))
      const today = new Date()
      const totalCells = weeks * DAYS_IN_WEEK
      const grid: { date: string; count: number; dayOfWeek: number }[] = []

      let max = 0
      let total = 0

      for (let i = totalCells - 1; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().slice(0, 10)
        const count = dataMap.get(dateStr) ?? 0
        max = Math.max(max, count)
        total += count
        grid.push({ date: dateStr, count, dayOfWeek: d.getDay() })
      }

      return { grid, maxCount: max, totalCount: total }
    }, [data, weeks])

    const svgWidth = weeks * (cellSize + cellGap) + 30 // 30px for day labels
    const svgHeight = DAYS_IN_WEEK * (cellSize + cellGap) + 20 // 20px for month labels

    return (
      <Stack
        ref={ref}
        direction="vertical"
        gap="sm"
        className={className}
        {...rest}
      >
        <div className="overflow-x-auto">
          <svg
            width={svgWidth}
            height={svgHeight}
            className="block"
            role="img"
            aria-label={`Activity heatmap showing ${totalCount} ${metricLabel}`}
          >
            {/* Day labels */}
            {DAY_LABELS.map((label, i) =>
              label ? (
                <text
                  key={`day-${i}`}
                  x={0}
                  y={20 + i * (cellSize + cellGap) + cellSize / 2}
                  className="fill-fg-secondary text-[9px]"
                  dominantBaseline="middle"
                >
                  {label}
                </text>
              ) : null
            )}

            {/* Grid cells */}
            {grid.map((cell, i) => {
              const weekIndex = Math.floor(i / DAYS_IN_WEEK)
              const dayIndex = i % DAYS_IN_WEEK
              const level = getIntensityLevel(cell.count, maxCount, colorLevels)
              const x = 30 + weekIndex * (cellSize + cellGap)
              const y = 20 + dayIndex * (cellSize + cellGap)

              return (
                <rect
                  key={cell.date}
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  rx={2}
                  className={cn(
                    intensityColors[level] ?? intensityColors[4],
                    'transition-all duration-fast',
                    'hover:stroke-border-focused hover:stroke-1'
                  )}
                  role="gridcell"
                  aria-label={`${cell.date}: ${cell.count} ${metricLabel}`}
                >
                  <title>{`${cell.date}: ${cell.count} ${metricLabel}`}</title>
                </rect>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <Stack direction="horizontal" gap="sm" align="center" justify="end">
          <Text as="span" variant="caption" color="secondary">
            Less
          </Text>
          {Array.from({ length: colorLevels + 1 }, (_, i) => (
            <svg key={i} width={cellSize} height={cellSize}>
              <rect
                width={cellSize}
                height={cellSize}
                rx={2}
                className={intensityColors[i] ?? intensityColors[colorLevels]}
              />
            </svg>
          ))}
          <Text as="span" variant="caption" color="secondary">
            More
          </Text>
        </Stack>
      </Stack>
    )
  }
)
ActivityHeatmap.displayName = 'ActivityHeatmap'

// ============================================================================
// ContributionGrid — Simplified grid-based alternative (CSS Grid, not SVG)
// ============================================================================

export interface ContributionGridProps extends React.HTMLAttributes<HTMLDivElement> {
  data: HeatmapData[]
  /** Number of columns (weeks) */
  columns?: number
  cellSize?: number
  metricLabel?: string
}

export const ContributionGrid = forwardRef<
  HTMLDivElement,
  ContributionGridProps
>(
  (
    {
      data,
      columns = 52,
      cellSize = 12,
      metricLabel = 'contributions',
      className,
      ...rest
    },
    ref
  ) => {
    const { grid, maxCount } = useMemo(() => {
      const dataMap = new Map(data.map((d) => [d.date, d.count]))
      const today = new Date()
      const totalCells = columns * DAYS_IN_WEEK
      const grid: { date: string; count: number }[] = []
      let max = 0

      for (let i = totalCells - 1; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().slice(0, 10)
        const count = dataMap.get(dateStr) ?? 0
        max = Math.max(max, count)
        grid.push({ date: dateStr, count })
      }

      return { grid, maxCount: max }
    }, [data, columns])

    return (
      <div
        ref={ref}
        className={cn('overflow-x-auto', className)}
        role="grid"
        aria-label={`Contribution grid`}
        {...rest}
      >
        <div
          className="grid gap-[3px]"
          style={{
            gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${DAYS_IN_WEEK}, ${cellSize}px)`,
            gridAutoFlow: 'column',
          }}
        >
          {grid.map((cell) => {
            const level = getIntensityLevel(cell.count, maxCount, 4)
            const bgMap: Record<number, string> = {
              0: 'bg-surface-sunken',
              1: 'bg-action-primary-subtle',
              2: 'bg-action-primary/40',
              3: 'bg-action-primary/65',
              4: 'bg-action-primary',
            }
            return (
              <Tooltip
                key={cell.date}
                content={`${cell.date}: ${cell.count} ${metricLabel}`}
                size="sm"
              >
                <div
                  className={cn(
                    'rounded-[2px] transition-all duration-fast',
                    bgMap[level],
                    'hover:ring-1 hover:ring-border-focused'
                  )}
                  style={{ width: cellSize, height: cellSize }}
                  role="gridcell"
                  aria-label={`${cell.date}: ${cell.count} ${metricLabel}`}
                />
              </Tooltip>
            )
          })}
        </div>
      </div>
    )
  }
)
ContributionGrid.displayName = 'ContributionGrid'
