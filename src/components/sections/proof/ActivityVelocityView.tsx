'use client'

import React from 'react'
import { Text } from '@/src/components/ui/Text/Text'
import { Badge } from '@/src/components/ui/Badge/Badge'
import { Button } from '@/src/components/ui/Button/Button'
import { BentoGrid, BentoCard, ActivityHeatmap } from '@/src/containers'
import { ArrowUpRight } from 'lucide-react'
import type {
  HeatmapData,
  HeatmapMonthLabel,
} from '@/src/containers/ActivityHeatmap'
import type { LeetCodeApiResponse } from '@/app/api/leetcode/route'

export interface GitHubActivityStats {
  year: number
  weeks: (HeatmapData | null)[][]
  monthLabels: HeatmapMonthLabel[]
  totalContributions: number
  activeDays: number
  currentStreak: number
  longestStreak: number
  isLive: boolean
}

export interface ActivityVelocityViewProps {
  githubData: GitHubActivityStats
  leetcodeStats: LeetCodeApiResponse
}

export function ActivityVelocityView({
  githubData,
  leetcodeStats,
}: ActivityVelocityViewProps) {
  return (
    <div className="w-full animate-in fade-in duration-fast">
      <BentoGrid columns={3} className="bg-transparent">
        {/* Card 1: GitHub Velocity starting from January */}
        <BentoCard
          colSpan={2}
          variant="glass"
          className="flex flex-col justify-between gap-6 p-5 sm:p-6"
        >
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col">
              <Text as="h3" variant="subheader" weight="bold">
                {githubData.totalContributions} contributions in {githubData.year}
              </Text>
              <Text variant="caption" color="secondary" className="mt-0.5">
                Jan {githubData.year} – Dec {githubData.year} • GitHub activity @Ansh-dS
              </Text>
            </div>

            {githubData.isLive && (
              <Badge color="success" size="sm">
                Live Feed
              </Badge>
            )}
          </div>

          {/* GitHub Calendar (Vertically and Horizontally Centered in Card) */}
          <div className="my-auto py-2 flex flex-col items-center justify-center w-full">
            <ActivityHeatmap
              weeksData={githubData.weeks}
              monthLabels={githubData.monthLabels}
              totalCount={githubData.totalContributions}
              footerRight={
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() =>
                    window.open('https://github.com/Ansh-dS', '_blank')
                  }
                  endIcon={<ArrowUpRight className="size-3.5 opacity-70" />}
                  aria-label="Visit GitHub Profile @Ansh-dS"
                >
                  @Ansh-dS
                </Button>
              }
            />
          </div>
        </BentoCard>

        {/* Card 2: Recruiter-Focused Algorithmic Performance */}
        <BentoCard
          colSpan={1}
          variant="glass"
          className="flex flex-col justify-between gap-4 p-5 sm:p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col text-left">
              <Text as="h3" variant="subheader" weight="bold">
                Algorithmic Practice
              </Text>
              <Text variant="caption" color="secondary" className="mt-0.5">
                LeetCode @0hUybs2mus
              </Text>
            </div>

            {leetcodeStats.isLive && (
              <Badge color="success" size="sm" className="gap-1.5">
                <span className="size-1.5 rounded-pill bg-status-success animate-pulse" />
                Live Feed
              </Badge>
            )}
          </div>

          {/* Contest Performance Topline: Rating, Contests, and Language */}
          <div className="my-auto p-4 sm:p-5 rounded-medium bg-surface-sunken/60 border border-border-default/40 flex items-center justify-between">
            <div className="flex flex-col">
              <Text
                variant="caption"
                color="secondary"
                className="uppercase tracking-wider font-semibold text-[10px]"
              >
                Contest Rating
              </Text>
              <Text
                as="span"
                variant="h1"
                weight="bold"
                className="mt-1 leading-none text-fg-primary font-mono text-3xl sm:text-4xl"
              >
                {leetcodeStats.rating.toLocaleString()}
              </Text>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <Badge color="info" size="sm" className="font-mono">
                {leetcodeStats.attendedContests} Contests
              </Badge>
              <Badge
                color="default"
                size="sm"
                className="font-mono text-[10px]"
              >
                C++ Primary
              </Badge>
            </div>
          </div>

          {/* Direct Profile CTAs (Contest Profile + 250+ Practice) */}
          <div className="pt-2 border-t border-border-default/30 w-full flex flex-col sm:flex-row gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() =>
                window.open(leetcodeStats.profileUrl, '_blank')
              }
              endIcon={<ArrowUpRight className="size-3.5 opacity-70" />}
              className="w-full flex-1"
              aria-label="View LeetCode Contest Profile @0hUybs2mus"
            >
              Contest Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                window.open(
                  'https://leetcode.com/u/Anshdeep_Singh_D/',
                  '_blank'
                )
              }
              endIcon={<ArrowUpRight className="size-3.5 opacity-70" />}
              className="w-full sm:w-auto"
              aria-label="View 250+ Problems LeetCode Practice Profile"
            >
              250+ Practice
            </Button>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  )
}
