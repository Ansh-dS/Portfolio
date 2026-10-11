'use client'

import React from 'react'
import { Box } from '@/src/components/ui/Box/Box'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { Stat } from '@/src/components/ui/Stat/Stat'
import {
  BentoGrid,
  BentoCard,
  ActivityHeatmap,
  ArcGauge,
  HeatmapData,
} from '@/src/containers'

const DEFAULT_HEATMAP_DATA: HeatmapData[] = Array.from({ length: 365 }).map(
  (_, i) => ({
    date: new Date(1791500000000 - i * 86400000).toISOString(),
    count: (i * 7 + 3) % 5,
  })
)

export interface ProofSectionProps {
  heatmapData?: HeatmapData[]
}

export function ProofSection({
  heatmapData = DEFAULT_HEATMAP_DATA,
}: ProofSectionProps) {
  return (
    <Box
      id="proof"
      className="w-full border-0 bg-transparent animate-in fade-in duration-fast"
    >
      <Stack direction="vertical" gap="lg" className="w-full bg-transparent">
        <div className="flex flex-col gap-1">
          <Text
            variant="caption"
            color="brand"
            weight="semibold"
            className="uppercase tracking-widest"
          >
            DATA &amp; VERIFIABLE PROOF
          </Text>
          <Text as="h2" variant="h1" weight="bold">
            Velocity &amp; Open Source
          </Text>
          <Text variant="body" color="secondary">
            Continuous algorithmic practice and contributions to production
            ecosystems.
          </Text>
        </div>

        <BentoGrid columns={3} className="mt-4 bg-transparent">
          <BentoCard
            colSpan={2}
            variant="glass"
            className="flex flex-col gap-6"
          >
            <Text as="h4" variant="subheader" weight="semibold">
              GitHub Velocity
            </Text>
            <ActivityHeatmap data={heatmapData} />
          </BentoCard>

          <BentoCard
            colSpan={1}
            variant="glass"
            className="flex flex-col items-center justify-center gap-6 text-center"
          >
            <ArcGauge value={2000} max={3000} size={160} />
            <Stat
              label="1700-2000"
              value="Peak Algorithmic Rating"
              helpText="400+ Solved"
              align="center"
            />
          </BentoCard>
        </BentoGrid>
      </Stack>
    </Box>
  )
}
