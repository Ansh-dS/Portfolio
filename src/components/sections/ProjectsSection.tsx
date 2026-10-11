'use client'

import React from 'react'
import { Box } from '@/src/components/ui/Box/Box'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { Badge } from '@/src/components/ui/Badge/Badge'
import { Button } from '@/src/components/ui/Button/Button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/Tabs/Tabs'
import {
  AppleProductCard,
  ProjectShowcaseGroup,
  ProjectShowcaseRow,
} from '@/src/containers'
import { ArrowUpRight } from 'lucide-react'

export function ProjectsSection() {
  return (
    <Box id="projects" className="w-full border-0 bg-transparent animate-in fade-in duration-fast">
      <Tabs defaultValue="fullstack" variant="pill" size="md" className="w-full border-0 bg-transparent">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <Text variant="caption" color="brand" weight="semibold" className="uppercase tracking-widest">
              FEATURED ARCHITECTURE
            </Text>
            <Text as="h2" variant="h1" weight="bold">
              Flagship Systems
            </Text>
            <Text variant="body" color="secondary">
              Interactive state synchronizations &amp; async job orchestration engines.
            </Text>
          </div>

          <TabsList className="shrink-0">
            <TabsTrigger value="fullstack">Full-Stack</TabsTrigger>
            <TabsTrigger value="systems">GenAI &amp; Systems</TabsTrigger>
          </TabsList>
        </div>

        {/* SUBTAB 1: Full-Stack */}
        <TabsContent value="fullstack" className="mt-0 bg-transparent border-0">
          <ProjectShowcaseGroup>
            <Stack direction="vertical" gap="lg" className="w-full pb-36">
              {/* Project 1: Tally */}
              <ProjectShowcaseRow className="flex flex-col lg:flex-row items-center gap-xl lg:gap-2xl py-xl sm:py-3xl min-h-[60vh] w-full">
                <div className="lg:w-1/2 flex items-center justify-center w-full">
                  <AppleProductCard
                    videoSrc="/tally_demo.mov"
                    urlLabel="tally.so/builder"
                    liveUrl="https://tally-forms.duckdns.org/"
                    className="max-w-md w-full"
                  >
                    <div className="w-full h-full p-6 flex flex-col justify-center items-center bg-surface-sunken/80 font-mono text-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse" />
                        <Text variant="caption" color="brand" className="font-mono">LIVE PREVIEW SYNC &lt; 50ms</Text>
                      </div>
                      <Text as="p" variant="caption" color="secondary" className="font-mono text-xs opacity-70">
                        BroadcastChannel API State Diffusion
                      </Text>
                    </div>
                  </AppleProductCard>
                </div>

                <Stack direction="vertical" className="lg:w-1/2" gap="md">
                  <div>
                    <Text variant="caption" color="brand" weight="semibold" className="uppercase tracking-wider">
                      Real-Time Form Engine
                    </Text>
                    <Text as="h3" variant="h2" weight="bold" className="mt-1">
                      Tally — Form Builder
                    </Text>
                  </div>
                  <Text variant="body" color="secondary">
                    Real-time preview sync via BroadcastChannel API and distributed async background worker queues powered by Redis and BullMQ to eliminate main-thread lag.
                  </Text>
                  <Stack direction="horizontal" gap="sm" className="flex-wrap mt-2">
                    <Badge color="brand">Next.js 15</Badge>
                    <Badge color="brand">TypeScript</Badge>
                    <Badge color="brand">Redis</Badge>
                    <Badge color="brand">BullMQ</Badge>
                  </Stack>
                  <div className="pt-2">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => window.open('https://tally-forms.duckdns.org/', '_blank')}
                      endIcon={<ArrowUpRight className="size-3.5 opacity-70" />}
                      aria-label="Try Tally Form Builder live"
                    >
                      Try Yourself
                    </Button>
                  </div>
                </Stack>
              </ProjectShowcaseRow>

              {/* Clean Section Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border-default/30 to-transparent my-s" />

              {/* Project 2: Aura */}
              <ProjectShowcaseRow className="flex flex-col lg:flex-row items-center gap-xl lg:gap-2xl py-xl sm:py-3xl min-h-[60vh] w-full">
                <div className="lg:w-1/2 flex items-center justify-center w-full">
                  <AppleProductCard
                    videoSrc="/aura_demo.mov"
                    urlLabel="aura.dev/registry"
                    liveUrl="https://aura-stroybook.vercel.app/"
                    className="max-w-md w-full"
                  >
                    <div className="w-full h-full p-6 flex flex-col justify-center items-center bg-surface-sunken/80 font-mono text-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-status-info animate-pulse" />
                        <Text variant="caption" color="brand" className="font-mono">CLI REGISTRY SYNC &lt; 10ms</Text>
                      </div>
                      <Text as="p" variant="caption" color="secondary" className="font-mono text-xs opacity-70">
                        pnpm aura setup
                      </Text>
                    </div>
                  </AppleProductCard>
                </div>

                <Stack direction="vertical" className="lg:w-1/2" gap="md">
                  <div>
                    <Text variant="caption" color="brand" weight="semibold" className="uppercase tracking-wider">
                      Design Architecture &amp; CLI
                    </Text>
                    <Text as="h3" variant="h2" weight="bold" className="mt-1">
                      Aura — Design System &amp; Registry
                    </Text>
                  </div>
                  <Text variant="body" color="secondary">
                    A theme-agnostic design architecture and CLI engine distributing natively performant components via a serverless registry with zero React re-renders and zero runtime bloat.
                  </Text>
                  <Stack direction="horizontal" gap="sm" className="flex-wrap mt-2">
                    <Badge color="brand">TypeScript</Badge>
                    <Badge color="brand">CLI (go-aura)</Badge>
                    <Badge color="brand">Tailwind CSS</Badge>
                    <Badge color="brand">Turborepo</Badge>
                  </Stack>
                  <div className="pt-2">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => window.open('https://aura-stroybook.vercel.app/', '_blank')}
                      endIcon={<ArrowUpRight className="size-3.5 opacity-70" />}
                      aria-label="Try Aura Storybook live"
                    >
                      Try Yourself
                    </Button>
                  </div>
                </Stack>
              </ProjectShowcaseRow>
            </Stack>
          </ProjectShowcaseGroup>
        </TabsContent>

        {/* SUBTAB 2: GenAI & Systems */}
        <TabsContent value="systems" className="mt-0 bg-transparent">
          <ProjectShowcaseGroup>
            <ProjectShowcaseRow className="flex flex-col lg:flex-row items-center gap-xl lg:gap-2xl py-xl sm:py-3xl min-h-[60vh] w-full">
              <div className="lg:w-1/2 flex items-center justify-center w-full">
                <AppleProductCard
                  urlLabel="queue.internal/agents"
                  className="max-w-md w-full"
                >
                  <div className="w-full h-full p-6 flex flex-col justify-center items-center bg-surface-sunken/80 font-mono text-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-status-info animate-pulse" />
                      <Text variant="caption" color="brand" className="font-mono">DISTRIBUTED WORKER POOL</Text>
                    </div>
                    <Text as="p" variant="caption" color="secondary" className="font-mono text-xs opacity-70">
                      Autonomous Agent Concurrency Pipeline
                    </Text>
                  </div>
                </AppleProductCard>
              </div>

              <Stack direction="vertical" className="lg:w-1/2" gap="md">
                <div>
                  <Text variant="caption" color="brand" weight="semibold" className="uppercase tracking-wider">
                    Async Job Orchestration
                  </Text>
                  <Text as="h3" variant="h2" weight="bold" className="mt-1">
                    Cognitive Agent Task Queue
                  </Text>
                </div>
                <Text variant="body" color="secondary">
                  Fault-tolerant task execution pipeline with automatic retry backoff, telemetry tracing, and distributed concurrency controls built for high-throughput LLM pipelines.
                </Text>
                <Stack direction="horizontal" gap="sm" className="flex-wrap mt-2">
                  <Badge color="brand">Node.js</Badge>
                  <Badge color="brand">Redis Streams</Badge>
                  <Badge color="brand">Docker</Badge>
                  <Badge color="brand">PostgreSQL</Badge>
                </Stack>
              </Stack>
            </ProjectShowcaseRow>
          </ProjectShowcaseGroup>
        </TabsContent>
      </Tabs>
    </Box>
  )
}
