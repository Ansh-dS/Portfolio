'use client'

import React from 'react'
import { Box } from '@/src/components/ui/Box/Box'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { Card } from '@/src/components/ui/Card/Card'
import { ArticleCard, TerminalWindow, TerminalLine } from '@/src/containers'

const DEFAULT_TERMINAL_LINES: TerminalLine[] = [
  {
    text: "const channel = new BroadcastChannel('tally_sync');",
    type: 'input',
    prompt: '> ',
  },
  { text: 'channel.onmessage = (e) => {', type: 'input', prompt: '  ' },
  {
    text: "  if (e.data.type === 'SYNC_STATE') {",
    type: 'input',
    prompt: '  ',
  },
  { text: '    applyDiff(e.data.payload);', type: 'input', prompt: '  ' },
  { text: '  }', type: 'input', prompt: '  ' },
  { text: '};', type: 'input', prompt: '  ' },
]

export interface ArchitectureSectionProps {
  terminalLines?: TerminalLine[]
}

export function ArchitectureSection({
  terminalLines = DEFAULT_TERMINAL_LINES,
}: ArchitectureSectionProps) {
  return (
    <Box
      id="architecture"
      className="w-full border-0 bg-transparent animate-in fade-in duration-fast"
    >
      <Stack direction="vertical" gap="lg" className="w-full">
        <div className="flex flex-col gap-1">
          <Text
            variant="caption"
            color="brand"
            weight="semibold"
            className="uppercase tracking-widest"
          >
            SYSTEM DESIGN &amp; WRITING
          </Text>
          <Text as="h2" variant="h1" weight="bold">
            Engineering Notes
          </Text>
          <Text variant="body" color="secondary">
            Deep dives on concurrency, distributed locks, and main-thread
            performance.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <ArticleCard
            title="Asynchronous Queues at Scale"
            excerpt="Exploring Redis & BullMQ patterns for background task processing in distributed systems."
            coverImage="/api/placeholder/400/200"
            date="Oct 8, 2026"
            readTime="5 min read"
            className="bg-transparent"
          />

          <Card variant="glass" padding="md" className="gap-4">
            <TerminalWindow title="sync_worker.ts" lines={terminalLines} />
            <Text
              as="h4"
              variant="subheader"
              weight="semibold"
              className="mt-2"
            >
              Eradicating Main-Thread Bottlenecks
            </Text>
          </Card>
        </div>
      </Stack>
    </Box>
  )
}
