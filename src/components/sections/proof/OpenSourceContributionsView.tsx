'use client'

import React from 'react'
import { Text } from '@/src/components/ui/Text/Text'
import { Badge } from '@/src/components/ui/Badge/Badge'
import { Button } from '@/src/components/ui/Button/Button'
import { Tabs, TabsList, TabsTrigger } from '@/src/components/ui/Tabs/Tabs'
import { DataList, DataListItem } from '@/src/components/ui/DataList/DataList'
import {
  ArrowUpRight,
  GitMerge,
  GitPullRequest,
  AlertCircle,
  ChevronDown,
} from 'lucide-react'
import type {
  ContributionCategory,
  OpenSourceContribution,
  CATEGORY_COUNTS,
} from '@/src/data/openSourceContributions'

export interface OpenSourceContributionsViewProps {
  filter: ContributionCategory
  onFilterChange: (filter: ContributionCategory) => void
  expandedId: string | null
  onToggleExpand: (id: string) => void
  contributions: OpenSourceContribution[]
  counts: typeof CATEGORY_COUNTS
}

export function OpenSourceContributionsView({
  filter,
  onFilterChange,
  expandedId,
  onToggleExpand,
  contributions,
  counts,
}: OpenSourceContributionsViewProps) {
  return (
    <div className="flex flex-col gap-m w-full animate-in fade-in duration-fast">
      {/* Filter Row with Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-s">
        <Text variant="caption" color="secondary">
          Production-grade fixes and maintainer-reviewed PRs across public
          repositories.
        </Text>

        <Tabs
          value={filter}
          onTabChange={(tab) => onFilterChange(tab as ContributionCategory)}
          variant="underline"
          size="sm"
        >
          <TabsList>
            <TabsTrigger
              value="merged"
              startIcon={<GitMerge className="size-3.5" />}
            >
              Merged ({counts.merged})
            </TabsTrigger>
            <TabsTrigger
              value="open-prs"
              startIcon={<GitPullRequest className="size-3.5" />}
            >
              Open PRs ({counts['open-prs']})
            </TabsTrigger>
            <TabsTrigger
              value="open-issues"
              startIcon={<AlertCircle className="size-3.5" />}
            >
              Open Issues ({counts['open-issues']})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* DataList Showcase: Clean Compact Rows with Expand on Click */}
      <DataList variant="ghost" spacing="default">
        {contributions.map((item) => {
          const isExpanded = expandedId === item.id
          return (
            <DataListItem
              key={item.id}
              interactive
              onClick={() => onToggleExpand(item.id)}
              className="flex flex-col items-stretch gap-s cursor-pointer"
            >
              {/* Primary Row: Title, Impact Tag, and Actions */}
              <div className="flex items-center justify-between gap-m w-full">
                <div className="flex flex-wrap items-center gap-s min-w-0 flex-1">
                  <Text as="h4" variant="subheader" weight="semibold">
                    {item.title}
                  </Text>

                  {item.impactBadge && (
                    <Badge color="default" size="sm">
                      {item.impactBadge}
                    </Badge>
                  )}
                </div>

                {/* Right Actions: GitHub button & Expand Indicator */}
                <div className="flex items-center gap-s shrink-0">
                  <Button
                    variant="glass"
                    size="sm"
                    endIcon={<ArrowUpRight className="size-3.5 opacity-70" />}
                    aria-label={`View ${item.title} on GitHub`}
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(item.link, '_blank')
                    }}
                  >
                    GitHub
                  </Button>

                  <span
                    className={`p-xs text-fg-secondary transition-transform duration-fast ${
                      isExpanded ? 'rotate-180 text-fg-primary' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown className="size-4" />
                  </span>
                </div>
              </div>

              {/* Expandable Technical Summary (Progressive Disclosure) */}
              {isExpanded && (
                <div className="pt-xs border-t border-border-default/40 w-full animate-in fade-in duration-fast">
                  <Text
                    variant="caption"
                    color="secondary"
                    className="leading-body"
                  >
                    {item.summary}
                  </Text>
                </div>
              )}
            </DataListItem>
          )
        })}
      </DataList>
    </div>
  )
}
