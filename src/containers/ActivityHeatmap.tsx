'use client'

import React, { forwardRef, useMemo, useState } from 'react'
import { cn } from '@/src/components/ui/Utils/utils'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { Tooltip } from '@/src/components/ui/Tooltip/Tooltip'
import { useTheme } from '@/src/components/core/theme-provider'

// ============================================================================
// ActivityHeatmap — GitHub-style contribution grid (SVG-based)
// ============================================================================

export interface HeatmapData {
  /** ISO date string (YYYY-MM-DD) */
  date: string
  /** Activity count */
  count: number
  /** Level 0 to 4 */
  level?: number
  dayOfWeek?: number
}

export interface HeatmapMonthLabel {
  label: string
  colIndex: number
}

export interface ActivityHeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of { date, count } entries (used if weeksData not provided) */
  data?: HeatmapData[]
  /** Direct 52/53-week columns array from GitHub API */
  weeksData?: (HeatmapData | null)[][]
  /** Month labels across the weeks */
  monthLabels?: HeatmapMonthLabel[]
  /** Cell size in pixels (default 10.5px like GitHub) */
  cellSize?: number
  /** Gap between cells in pixels (default 3px) */
  cellGap?: number
  /** Label for the metric (e.g., "contributions") */
  metricLabel?: string
  /** Total count to display */
  totalCount?: number
  /** Optional element placed on the left side of the bottom legend row */
  footerLeft?: React.ReactNode
  /** Optional element placed on the right side of the bottom legend row */
  footerRight?: React.ReactNode
}

const DAYS_IN_WEEK = 7
const DAY_LABELS: { label: string; row: number }[] = [
  { label: 'Mon', row: 1 },
  { label: 'Wed', row: 3 },
  { label: 'Fri', row: 5 },
]

// Authentic GitHub Contribution palette for Dark Mode with clear contrast
const GITHUB_DARK_COLORS: Record<number, string> = {
  0: '#1e2633', // Clearly visible dark slate square (contrasts against card canvas)
  1: '#0e4429', // Dark emerald
  2: '#006d32', // Medium green
  3: '#26a641', // Bright green
  4: '#39d353', // Vibrant neon green
}

// Authentic GitHub Contribution palette for Light Mode
const GITHUB_LIGHT_COLORS: Record<number, string> = {
  0: '#ebedf0', // GitHub light neutral background cell
  1: '#9be9a8', // Soft light green
  2: '#40c463', // Medium vibrant green
  3: '#30a14e', // Deep rich green
  4: '#216e39', // Forest green
}

export const ActivityHeatmap = forwardRef<HTMLDivElement, ActivityHeatmapProps>(
  (
    {
      data = [],
      weeksData,
      monthLabels: monthLabelsProp,
      cellSize = 10.5,
      cellGap = 3,
      metricLabel = 'contributions',
      totalCount: totalCountProp,
      footerLeft,
      footerRight,
      className,
      ...rest
    },
    ref
  ) => {
    const { mode } = useTheme()
    const isDark = mode === 'dark'
    const levelColors = isDark ? GITHUB_DARK_COLORS : GITHUB_LIGHT_COLORS

    // Build weeks array from either weeksData prop or raw flat data
    const { columns, computedMonths, totalCount } = useMemo(() => {
      if (weeksData && weeksData.length > 0) {
        let total = 0
        for (const week of weeksData) {
          for (const day of week) {
            if (day) total += day.count
          }
        }
        return {
          columns: weeksData,
          computedMonths: monthLabelsProp || [],
          totalCount: totalCountProp ?? total,
        }
      }

      // Fallback: convert flat data into 52 Sunday-to-Saturday columns
      const dataMap = new Map(data.map((d) => [d.date, d]))
      const currentYear = new Date().getFullYear()
      const cursor = new Date(currentYear, 0, 1)
      const startDay = cursor.getDay()
      cursor.setDate(cursor.getDate() - startDay)

      const cols: (HeatmapData | null)[][] = []
      const months: HeatmapMonthLabel[] = []
      let lastMonth = -1
      let total = 0

      for (let w = 0; w < 52; w++) {
        const week: (HeatmapData | null)[] = []
        for (let d = 0; d < 7; d++) {
          const m = cursor.getMonth()
          if (
            m !== lastMonth &&
            d === 0 &&
            cursor.getFullYear() === currentYear
          ) {
            months.push({
              label: cursor.toLocaleString('default', { month: 'short' }),
              colIndex: w,
            })
            lastMonth = m
          }
          const dateStr = cursor.toISOString().slice(0, 10)
          const entry = dataMap.get(dateStr)
          const count = entry?.count ?? 0
          const level =
            entry?.level ??
            (count === 0
              ? 0
              : count <= 1
                ? 1
                : count <= 3
                  ? 2
                  : count <= 5
                    ? 3
                    : 4)
          week.push({ date: dateStr, count, level, dayOfWeek: d })
          total += count
          cursor.setDate(cursor.getDate() + 1)
        }
        cols.push(week)
      }

      return {
        columns: cols,
        computedMonths: monthLabelsProp || months,
        totalCount: totalCountProp ?? total,
      }
    }, [data, weeksData, monthLabelsProp, totalCountProp])

    const totalWeeks = columns.length
    const labelColOffset = 30 // Space on left for Mon, Wed, Fri
    const headerHeight = 18 // Space on top for month labels
    const svgWidth = labelColOffset + totalWeeks * (cellSize + cellGap) + 4
    const svgHeight = headerHeight + DAYS_IN_WEEK * (cellSize + cellGap) + 4

    const [hoveredCell, setHoveredCell] = useState<{
      x: number
      y: number
      count: number
      date: string
    } | null>(null)

    return (
      <Stack
        ref={ref}
        direction="vertical"
        gap="sm"
        className={cn('w-full', className)}
        {...rest}
      >
        {/* SVG Container with hidden scrollbar */}
        <div className="overflow-x-auto w-full py-1 flex justify-start lg:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="relative inline-block">
            <svg
              width={svgWidth}
              height={svgHeight}
              className="block select-none shrink-0"
              role="img"
              aria-label={`Activity heatmap showing ${totalCount} ${metricLabel}`}
            >
              {/* 1. Month Labels Header across the top */}
              {computedMonths.map((m, idx) => {
                const x = labelColOffset + m.colIndex * (cellSize + cellGap)
                return (
                  <text
                    key={`${m.label}-${idx}`}
                    x={x}
                    y={12}
                    className="fill-fg-secondary text-[10px] font-normal"
                    textAnchor="start"
                  >
                    {m.label}
                  </text>
                )
              })}

              {/* 2. Day Labels on the Left (Mon, Wed, Fri) */}
              {DAY_LABELS.map(({ label, row }) => (
                <text
                  key={label}
                  x={0}
                  y={headerHeight + row * (cellSize + cellGap) + cellSize / 2 + 3}
                  className="fill-fg-secondary text-[9px] font-normal"
                  dominantBaseline="middle"
                >
                  {label}
                </text>
              ))}

              {/* 3. Contribution Grid Cells with custom Tooltip hover */}
              {columns.map((week, weekIndex) => {
                const x = labelColOffset + weekIndex * (cellSize + cellGap)

                return week.map((cell, dayIndex) => {
                  if (!cell) return null

                  const y = headerHeight + dayIndex * (cellSize + cellGap)
                  const level = cell.level ?? 0
                  const fill = levelColors[level] || levelColors[0]
                  const strokeColor =
                    level === 0
                      ? isDark
                        ? 'rgba(255, 255, 255, 0.14)' // High-contrast visible border in dark mode
                        : 'rgba(27, 31, 35, 0.08)' // Clean subtle border in light mode
                      : isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)'

                  return (
                    <rect
                      key={cell.date}
                      x={x}
                      y={y}
                      width={cellSize}
                      height={cellSize}
                      rx={2}
                      fill={fill}
                      stroke={strokeColor}
                      strokeWidth={0.8}
                      className="transition-colors duration-fast hover:stroke-border-focused hover:stroke-[1.5px] cursor-pointer"
                      role="gridcell"
                      aria-label={`${cell.count} ${metricLabel} on ${cell.date}`}
                      onMouseEnter={() =>
                        setHoveredCell({
                          x: x + cellSize / 2,
                          y,
                          count: cell.count,
                          date: cell.date,
                        })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  )
                })
              })}
            </svg>

            {/* Custom UI Tooltip on Hover */}
            {hoveredCell && (
              <div
                className="absolute pointer-events-none z-50 -translate-x-1/2 -translate-y-full"
                style={{
                  left: hoveredCell.x,
                  top: hoveredCell.y - 2,
                }}
              >
                <Tooltip
                  forceVisible
                  position="top"
                  variant={isDark ? 'glass' : 'dark'}
                  size="sm"
                  content={`${hoveredCell.count === 0 ? 'No' : hoveredCell.count} ${metricLabel} on ${hoveredCell.date}`}
                >
                  <span className="inline-block w-0 h-0" />
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        {/* 4. Legend & Action Row at Bottom (Aligned with SVG and centered) */}
        <div
          className="flex items-center justify-between gap-3 text-xs text-fg-secondary pt-2 px-0.5 border-t border-border-default/20 w-full mx-auto"
          style={{ maxWidth: svgWidth }}
        >
          {/* Left Side: Less...More Legend (or footerLeft if specifically provided) */}
          {footerLeft ? (
            <div className="flex items-center">{footerLeft}</div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Text
                as="span"
                variant="caption"
                color="secondary"
                className="mr-0.5"
              >
                Less
              </Text>
              {[0, 1, 2, 3, 4].map((lvl) => (
                <span
                  key={lvl}
                  className="inline-block rounded-[2px]"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: levelColors[lvl],
                    border:
                      lvl === 0
                        ? isDark
                          ? '0.8px solid rgba(255, 255, 255, 0.14)'
                          : '0.8px solid rgba(27, 31, 35, 0.12)'
                        : 'none',
                  }}
                />
              ))}
              <Text
                as="span"
                variant="caption"
                color="secondary"
                className="ml-0.5"
              >
                More
              </Text>
            </div>
          )}

          {/* Right Side: Action Button (footerRight) or Less...More if footerLeft was used */}
          {footerRight ? (
            <div className="flex items-center ml-auto">{footerRight}</div>
          ) : footerLeft ? (
            <div className="flex items-center gap-1.5 ml-auto">
              <Text
                as="span"
                variant="caption"
                color="secondary"
                className="mr-0.5"
              >
                Less
              </Text>
              {[0, 1, 2, 3, 4].map((lvl) => (
                <span
                  key={lvl}
                  className="inline-block rounded-[2px]"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: levelColors[lvl],
                    border:
                      lvl === 0
                        ? isDark
                          ? '0.8px solid rgba(255, 255, 255, 0.14)'
                          : '0.8px solid rgba(27, 31, 35, 0.12)'
                        : 'none',
                  }}
                />
              ))}
              <Text
                as="span"
                variant="caption"
                color="secondary"
                className="ml-0.5"
              >
                More
              </Text>
            </div>
          ) : null}
        </div>
      </Stack>
    )
  }
)

ActivityHeatmap.displayName = 'ActivityHeatmap'

// ============================================================================
// ContributionGrid — Simplified grid-based alternative
// ============================================================================

export interface ContributionGridProps extends React.HTMLAttributes<HTMLDivElement> {
  data: HeatmapData[]
  columns?: number
  cellSize?: number
  metricLabel?: string
}

export const ContributionGrid = ActivityHeatmap
