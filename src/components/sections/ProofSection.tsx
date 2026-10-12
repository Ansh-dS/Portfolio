'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Box } from '@/src/components/ui/Box/Box'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { Tabs, TabsList, TabsTrigger } from '@/src/components/ui/Tabs/Tabs'
import { Activity, GitPullRequest } from 'lucide-react'
import {
  ActivityVelocityView,
  OpenSourceContributionsView,
  type GitHubActivityStats,
} from './proof'
import {
  OPEN_SOURCE_CONTRIBUTIONS,
  CATEGORY_COUNTS,
  DEFAULT_LEETCODE,
  type ContributionCategory,
  type OpenSourceContribution,
} from '@/src/data/openSourceContributions'
import type { GitHubApiResponse } from '@/app/api/github/route'
import type { LeetCodeApiResponse } from '@/app/api/leetcode/route'

// Re-export data models and constants for backwards compatibility
export {
  OPEN_SOURCE_CONTRIBUTIONS,
  CATEGORY_COUNTS,
  DEFAULT_LEETCODE,
}
export type { ContributionCategory, OpenSourceContribution }

export interface ProofSectionProps {
  subTab?: 'activity' | 'contributions'
  onSubTabChange?: (subTab: 'activity' | 'contributions') => void
}

export function ProofSection({
  subTab: controlledSubTab,
  onSubTabChange,
}: ProofSectionProps = {}) {
  const [internalSubTab, setInternalSubTab] = useState<
    'activity' | 'contributions'
  >(controlledSubTab ?? 'activity')

  useEffect(() => {
    if (controlledSubTab) {
      setInternalSubTab(controlledSubTab)
    }
  }, [controlledSubTab])

  const proofSubTab = controlledSubTab ?? internalSubTab

  const handleSubTabChange = (tab: 'activity' | 'contributions') => {
    setInternalSubTab(tab)
    onSubTabChange?.(tab)
  }

  const [githubData, setGithubData] = useState<GitHubActivityStats>({
    year: 2026,
    weeks: [],
    monthLabels: [],
    totalContributions: 132,
    activeDays: 48,
    currentStreak: 7,
    longestStreak: 7,
    isLive: false,
  })

  const [leetcodeStats, setLeetcodeStats] =
    useState<LeetCodeApiResponse>(DEFAULT_LEETCODE)

  const [openSourceFilter, setOpenSourceFilter] = useState<ContributionCategory>('merged')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredContributions = useMemo(
    () =>
      OPEN_SOURCE_CONTRIBUTIONS.filter(
        (item) => item.category === openSourceFilter
      ),
    [openSourceFilter]
  )

  useEffect(() => {
    // 1. Fetch live GitHub contributions
    fetch('/api/github')
      .then((res) => res.json())
      .then((data: GitHubApiResponse) => {
        if (data.success) {
          setGithubData({
            year: data.year || 2026,
            weeks: data.weeks || [],
            monthLabels: data.monthLabels || [],
            totalContributions: data.totalContributions,
            activeDays: data.activeDays,
            currentStreak: data.currentStreak,
            longestStreak: data.longestStreak,
            isLive: data.isLive,
          })
        }
      })
      .catch((err) => {
        console.error('Failed to load GitHub live data:', err)
      })

    // 2. Fetch live LeetCode stats
    fetch('/api/leetcode')
      .then((res) => res.json())
      .then((data: LeetCodeApiResponse) => {
        if (data.success) {
          setLeetcodeStats(data)
        }
      })
      .catch((err) => {
        console.error('Failed to load LeetCode live data:', err)
      })
  }, [])

  return (
    <Box
      id="proof"
      className="w-full border-0 bg-transparent animate-in fade-in duration-fast"
    >
      <Stack direction="vertical" gap="lg" className="w-full bg-transparent">
        {/* Section Header */}
        <div className="flex flex-col gap-1">
          <Text
            variant="caption"
            color="brand"
            weight="semibold"
            className="uppercase tracking-widest"
          >
            ACTIVITY &amp; VERIFIABLE PROOF
          </Text>
          <Text as="h2" variant="h1" weight="bold">
            Coding Activity &amp; Proof
          </Text>
          <Text variant="body" color="secondary">
            Continuous algorithmic practice and contributions to production
            ecosystems.
          </Text>
        </div>

        {/* Top-Level Navigation Sub-Tabs */}
        <div>
          <Tabs
            value={proofSubTab}
            onTabChange={(tab) =>
              handleSubTabChange(tab as 'activity' | 'contributions')
            }
            variant="glass"
            size="md"
          >
            <TabsList className="border-border-default/60 rounded-medium">
              <TabsTrigger
                value="activity"
                startIcon={<Activity className="size-4" />}
              >
                Activity &amp; Velocity
              </TabsTrigger>
              <TabsTrigger
                value="contributions"
                startIcon={<GitPullRequest className="size-4" />}
              >
                Open Source Contributions ({OPEN_SOURCE_CONTRIBUTIONS.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Sub-Tab 1: Activity & Velocity Bento Grid */}
        {proofSubTab === 'activity' && (
          <ActivityVelocityView
            githubData={githubData}
            leetcodeStats={leetcodeStats}
          />
        )}

        {/* Sub-Tab 2: Open Source Pull Requests & Testing Contributions */}
        {proofSubTab === 'contributions' && (
          <OpenSourceContributionsView
            filter={openSourceFilter}
            onFilterChange={(filter) => {
              setOpenSourceFilter(filter)
              setExpandedId(null)
            }}
            expandedId={expandedId}
            onToggleExpand={(id) =>
              setExpandedId((prev) => (prev === id ? null : id))
            }
            contributions={filteredContributions}
            counts={CATEGORY_COUNTS}
          />
        )}
      </Stack>
    </Box>
  )
}
