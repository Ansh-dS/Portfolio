'use client'

import React, { useState, useEffect, useRef, useId, useCallback } from 'react'
import { Box } from '@/src/components/ui/Box/Box'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { Badge } from '@/src/components/ui/Badge/Badge'
import { Button } from '@/src/components/ui/Button/Button'
import { Card } from '@/src/components/ui/Card/Card'
import { SocialButton } from '@/src/components/ui/SocialButton/SocialButton'
import { Stat } from '@/src/components/ui/Stat/Stat'
import { DotPattern } from '@/src/components/ui/DotPattern/DotPattern'
import { Modal } from '@/src/components/ui/Modal/Modal'
import { cn } from '@/src/components/ui/Utils/utils'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/Tabs/Tabs'
import { useTheme } from '@/src/components/core/theme-provider'
import { ThemeToggle } from '@/src/containers/ThemeToggle'
import { ArticleCard } from '@/src/containers/LinkPreviewCard'
import { TerminalWindow, Kbd, TerminalLine } from '@/src/containers/CodeBlock'
import { BentoGrid, BentoCard } from '@/src/containers/BentoGrid'
import { ActivityHeatmap } from '@/src/containers/ActivityHeatmap'
import { ArcGauge } from '@/src/containers/RadialProgress'
import { AppleProductCard, ProjectShowcaseContext } from '@/src/containers/AppleProductCard'
import { Avatar } from '@/src/components/ui/Avatar/Avatar'
import { GraduationCap, FileText, Zap, ArrowUpRight, Award } from 'lucide-react'
import ansh from '../public/ansh.jpg'

/**
 * ProjectShowcaseGroup & ProjectShowcaseRow — Coordinated Cinema Spotlight
 * Manages active handover between project showcases:
 * - When going down: 'up' project blurs when hitting upper screen (rect <= 20), 'down' project activates.
 * - When going up: 'down' project blurs when moving towards bottom edge, 'up' project activates!
 * - When bottom edge of viewport hits the first project (moving up to Hero), all blur.
 */
const ProjectShowcaseGroupContext = React.createContext<{
  registerRow: (id: string, el: HTMLElement) => void
  unregisterRow: (id: string) => void
  activeRowId: string | null
} | null>(null)

function ProjectShowcaseGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const rowsRef = useRef<Map<string, HTMLElement>>(new Map())
  const [activeRowId, setActiveRowId] = useState<string | null>(null)
  const lastScrollYRef = useRef(0)
  const scrollDirRef = useRef<'down' | 'up'>('down')

  const registerRow = useCallback((id: string, el: HTMLElement) => {
    rowsRef.current.set(id, el)
  }, [])

  const unregisterRow = useCallback((id: string) => {
    rowsRef.current.delete(id)
  }, [])

  useEffect(() => {
    lastScrollYRef.current = window.scrollY

    const updateActiveRow = () => {
      const vh = window.innerHeight
      const elementsWithIds = Array.from(rowsRef.current.entries()).filter(
        ([_, el]) => el.isConnected
      )

      if (elementsWithIds.length === 0) {
        setActiveRowId(null)
        return
      }

      // Sort rows top-to-bottom by vertical position in the document
      elementsWithIds.sort((a, b) => {
        const topA = a[1].getBoundingClientRect().top
        const topB = b[1].getBoundingClientRect().top
        return topA - topB
      })

      const firstRect = elementsWithIds[0][1].getBoundingClientRect()
      const lastRect = elementsWithIds[elementsWithIds.length - 1][1].getBoundingClientRect()

      // When moving up past the first project: bottom edge hits the first project -> blur all
      if (firstRect.top >= vh * 0.80) {
        setActiveRowId(null)
        return
      }

      // When scrolling down past the last project: upper screen hits the last project -> blur all
      if (lastRect.top <= 20) {
        setActiveRowId(null)
        return
      }

      const direction = scrollDirRef.current

      if (direction === 'up') {
        // When moving up: blur the 'down' project earlier when 30% covered by the bottom edge,
        // and activate the upper project immediately.
        let activeId: string | null = null
        for (let i = elementsWithIds.length - 1; i >= 0; i--) {
          const [id, el] = elementsWithIds[i]
          const rect = el.getBoundingClientRect()
          const isCovered30 = (rect.bottom - vh) >= 0.30 * rect.height
          if (!isCovered30) {
            activeId = id
            break
          }
        }
        setActiveRowId(activeId ?? elementsWithIds[0][0])
      } else {
        // When moving down: 'up' project blurs when hitting upper screen (rect.top <= 20),
        // and hands over focus to the next project below.
        const activeEntry = elementsWithIds.find(([_, el]) => {
          const rect = el.getBoundingClientRect()
          return rect.top > 20
        })
        setActiveRowId(activeEntry ? activeEntry[0] : null)
      }
    }

    updateActiveRow()

    let rafId: number | null = null
    const onScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollYRef.current) {
        scrollDirRef.current = 'down'
      } else if (currentScrollY < lastScrollYRef.current) {
        scrollDirRef.current = 'up'
      }
      lastScrollYRef.current = currentScrollY

      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        updateActiveRow()
        rafId = null
      })
    }

    const onResize = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        updateActiveRow()
        rafId = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <ProjectShowcaseGroupContext.Provider
      value={{ registerRow, unregisterRow, activeRowId }}
    >
      <div className={className}>{children}</div>
    </ProjectShowcaseGroupContext.Provider>
  )
}

function ProjectShowcaseRow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const rowId = useId()
  const rowRef = useRef<HTMLDivElement | null>(null)
  const group = React.useContext(ProjectShowcaseGroupContext)
  const [standaloneActive, setStandaloneActive] = useState(false)

  // Register with parent showcase group if present
  useEffect(() => {
    const el = rowRef.current
    if (!el || !group) return

    group.registerRow(rowId, el)
    return () => group.unregisterRow(rowId)
  }, [group, rowId])

  // Standalone fallback if rendered outside a ProjectShowcaseGroup
  useEffect(() => {
    if (group) return
    const el = rowRef.current
    if (!el) return

    const updateActiveState = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const isPastUpperScreen = rect.top <= 20
      const isCovered30 = (rect.bottom - vh) >= 0.30 * rect.height
      const isBelowViewport = rect.top >= vh * 0.80
      setStandaloneActive(!isPastUpperScreen && !isCovered30 && !isBelowViewport)
    }

    updateActiveState()

    let rafId: number | null = null
    const onScrollOrResize = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        updateActiveState()
        rafId = null
      })
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [group])

  const isActive = group ? group.activeRowId === rowId : standaloneActive

  return (
    <ProjectShowcaseContext.Provider value={{ isActive }}>
      <div
        ref={rowRef}
        className={cn(
          'transition-all duration-normal ease-out will-change-[filter,opacity,transform]',
          isActive
            ? 'opacity-100 blur-none scale-100'
            : 'opacity-35 blur-[1.5px] scale-[0.985]',
          className
        )}
      >
        {children}
      </div>
    </ProjectShowcaseContext.Provider>
  )
}

export default function Home() {
  const { mode, setMode } = useTheme()
  const [activeTab, setActiveTab] = useState('hero')
  const [copied, setCopied] = useState(false)
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)
  const [isCertificateOpen, setIsCertificateOpen] = useState(false)

  // Mock heatmap data for the ContributionGrid (deterministic anchor prevents hydration and prerender mismatches)
  const heatmapData = Array.from({ length: 365 }).map((_, i) => ({
    date: new Date(1791500000000 - i * 86400000).toISOString(),
    count: (i * 7 + 3) % 5,
  }))

  const terminalLines: TerminalLine[] = [
    { text: "const channel = new BroadcastChannel('tally_sync');", type: 'input', prompt: '> ' },
    { text: 'channel.onmessage = (e) => {', type: 'input', prompt: '  ' },
    { text: "  if (e.data.type === 'SYNC_STATE') {", type: 'input', prompt: '  ' },
    { text: '    applyDiff(e.data.payload);', type: 'input', prompt: '  ' },
    { text: '  }', type: 'input', prompt: '  ' },
    { text: '};', type: 'input', prompt: '  ' },
  ]

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'work', label: 'Work' },
    { id: 'projects', label: 'Projects' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'proof', label: 'Proof' },
  ]

  // Global keybindings: 'C' to copy email, numbers 1-5 to switch tabs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) {
        navigator.clipboard.writeText('ansh.dev.engg@gmail.com')
        setCopied(true)
        setTimeout(() => setCopied(false), 2200)
      } else if (e.key >= '1' && e.key <= '5') {
        const index = parseInt(e.key) - 1
        if (navItems[index]) {
          setActiveTab(navItems[index].id)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Box className="w-full overflow-x-hidden relative px-s py-m min-h-screen flex flex-col justify-between border-0">
      {/* SVG Dot Pattern (Hardware GPU accelerated single-tile vector) */}
      <DotPattern width={28} height={28} cr={1.5} fade className="z-base" />

      {/* Floating Ambient Halo */}
      <div className="bg-white/10 h-72 w-72 sm:h-96 sm:w-96 rounded-full absolute z-base top-60 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-3xl" />

      {/* Copied Email HUD Toast Notification */}
      {copied && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-toast animate-in fade-in duration-fast">
          <div className="px-4 py-2 rounded-full bg-surface-base/90 border border-status-success/50 backdrop-blur-md shadow-modal flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <Text variant="caption" weight="medium" color="primary">
              Copied email (ansh.dev.engg@gmail.com) to clipboard!
            </Text>
          </div>
        </div>
      )}

      {/* Persistent Floating Bottom Navigation Dock (Preserved exact appearance) */}
      <Tabs
        value={activeTab}
        onTabChange={setActiveTab}
        variant="glass"
        size="md"
        className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-toast shadow-modal max-w-[95vw] bg-surface-raised/30 rounded-large"
      >
        <TabsList className="items-center ">
          <ThemeToggle size="sm" />
          {navItems.map((item) => (
            <TabsTrigger key={item.id} value={item.id}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* The Single Wrapper Stage: Inner Content Morphs with the Active Tab */}
      <Stack className="z-overlay backdrop-blur-xs border-2 rounded-large relative border-border-default/15 shadow-overlay bg-surface-raised/20 w-full max-w-6xl mx-auto my-4 sm:my-8 items-stretch mb-24 transition-all duration-normal">
        <Stack
          direction="vertical"
          gap="lg"
          className="w-full px-6 sm:px-12 py-10 sm:py-20 items-stretch min-h-[520px] flex flex-col justify-between"
        >
          <Box className="w-full border-0 bg-transparent flex-1">
            {/* ======================================================== */}
            {/* TAB 1: HOME (Hero & Immediate Hook)                      */}
            {/* ======================================================== */}
            {activeTab === 'hero' && (
              <Box id="hero" className="w-full border-0 bg-transparent animate-in fade-in duration-fast">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16 w-full">
                  {/* Left Column: Copy, Badges, CTAs */}
                  <div className="flex flex-col items-start text-left w-full lg:w-3/5">
                    {/* Location / Status Kicker */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-base/80 border border-border-default/50 backdrop-blur-sm mb-6 whitespace-nowrap shadow-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse shrink-0" />
                      <Text variant="caption" color="secondary" weight="medium" className="whitespace-nowrap">
                        Based in Delhi, India • B.Sc. CS @ IIT Patna
                      </Text>
                    </div>

                    <Text as="h1" variant="display" weight="bold">
                      Anshdeep Singh.
                    </Text>

                    <Text as="h2" variant="h2" color="brand" weight="medium" className="mt-3">
                      Full-Stack &amp; Founding Engineer.
                    </Text>

                    <Text variant="body" color="secondary" className="mt-5 max-w-[36rem]">
                      Bridging complex backend architecture with zero-friction, high-performance UI.
                    </Text>

                    {/* Proof Badges */}
                    <div className="flex flex-wrap gap-2.5 mt-6 w-full">
                      <Badge color="info" size="sm">Ex-Backend Intern @ Prodesk IT, Remote</Badge>
                      <Badge color="info" size="sm">Merged Contributor @ Rocket.Chat @ Excalidraw</Badge>
                      <Badge color="info" size="sm">1700–2000 Leetcode Rating</Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row items-center gap-4 mt-8">
                      <Button variant="primary" size="md" onClick={() => setActiveTab('projects')}>
                        View Projects
                      </Button>
                      <Button variant="secondary" size="md" onClick={() => setActiveTab('work')}>
                        View Work
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Avatar with Ambient Halo & Floating Glass Chips */}
                  <div className="relative shrink-0 flex items-center justify-center w-full lg:w-auto my-4 lg:my-0">
                    <div className="absolute -inset-6 bg-linear-to-tr from-action-primary/20 via-action-accent/15 to-transparent rounded-full blur-2xl pointer-events-none" />

                    <Avatar
                      src={ansh.src}
                      className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 shadow-raised border-2 border-border-strong/30"
                      alt="Anshdeep Singh"
                    />

                    {/* Floating Glass Chip: Top Right (IIT Patna Transcript Modal Trigger) */}
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => setIsTranscriptOpen(true)}
                      startIcon={<GraduationCap className="size-3.5" />}
                      endIcon={<FileText className="size-3.5 opacity-70" />}
                      className="absolute -top-3 -right-2 sm:-right-4 z-10"
                      aria-label="View IIT Patna Academic Transcript"
                    >
                      IIT Patna &apos;26
                    </Button>

                    {/* Floating Glass Chip: Bottom Left (LeetCode Direct Redirect) */}
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => window.open('https://leetcode.com/u/Ansh-dS/', '_blank')}
                      startIcon={<Zap className="size-3.5 text-amber-500" />}
                      endIcon={<ArrowUpRight className="size-3.5 text-fg-brand opacity-70" />}
                      className="absolute -bottom-3 -left-2 sm:-left-4 z-10"
                      aria-label="Open LeetCode Profile"
                    >
                      400+ LeetCode
                    </Button>
                  </div>
                </div>
              </Box>
            )}

            {/* ======================================================== */}
            {/* TAB 2: WORK (Production Experience)                      */}
            {/* ======================================================== */}
            {activeTab === 'work' && (
              <Box id="work" className="w-full border-0 bg-transparent animate-in fade-in duration-fast">
                <Stack direction="vertical" gap="lg" className="w-full">
                  <div className="flex flex-col gap-1">
                    <Text variant="caption" color="brand" weight="semibold" className="uppercase tracking-widest">
                      EXPERIENCE &amp; IMPACT
                    </Text>
                    <Text as="h2" variant="h1" weight="bold">
                      Production Track Record
                    </Text>
                    <Text variant="body" color="secondary">
                      Engineering reliable REST microservices and database query optimization.
                    </Text>
                  </div>

                  <Card variant="outlined" padding="lg" className="mt-4 border-0">
                    <Stack direction="vertical" gap="md" className="border-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-default/40 pb-4 w-full">
                        <div>
                          <Text as="h3" variant="h3" weight="bold">
                            Backend Developer Intern
                          </Text>
                          <Text variant="label" color="brand" weight="medium">
                            @ Prodesk IT
                          </Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge color="info" size="sm" className="w-fit">
                            Remote • Summer 2025
                          </Badge>
                          <Button
                            variant="glass"
                            size="sm"
                            startIcon={<Award className="size-3.5" />}
                            onClick={() => setIsCertificateOpen(true)}
                            aria-label="View Internship Certificate"
                          >
                            Certificate
                          </Button>
                        </div>
                      </div>

                      <Text variant="body" color="secondary">
                        Engineered type-safe RESTful APIs, optimized PostgreSQL query plans for low-latency joins, and containerized microservices via Docker for automated deployment pipelines.
                      </Text>
                      <Stack direction="horizontal" gap="sm" className="flex-wrap mt-2">
                        <Badge color="brand">Node.js</Badge>
                        <Badge color="brand">PostgreSQL</Badge>
                        <Badge color="brand">Docker</Badge>
                        <Badge color="brand">JWT</Badge>
                      </Stack>
                    </Stack>
                  </Card>
                </Stack>
              </Box>
            )}

            {/* ======================================================== */}
            {/* TAB 3: PROJECTS (Flagship Systems)                       */}
            {/* ======================================================== */}
            {activeTab === 'projects' && (
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

                    <TabsList className="shrink-0 ">
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
                          videoSrc="/agent_queue_walkthrough.mp4"
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
            )}

            {/* ======================================================== */}
            {/* TAB 4: ARCHITECTURE (Engineering Notes)                  */}
            {/* ======================================================== */}
            {activeTab === 'architecture' && (
              <Box id="architecture" className="w-full border-0 bg-transparent animate-in fade-in duration-fast">
                <Stack direction="vertical" gap="lg" className="w-full">
                  <div className="flex flex-col gap-1">
                    <Text variant="caption" color="brand" weight="semibold" className="uppercase tracking-widest">
                      SYSTEM DESIGN &amp; WRITING
                    </Text>
                    <Text as="h2" variant="h1" weight="bold">
                      Engineering Notes
                    </Text>
                    <Text variant="body" color="secondary">
                      Deep dives on concurrency, distributed locks, and main-thread performance.
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
                      <Text as="h4" variant="subheader" weight="semibold" className="mt-2">
                        Eradicating Main-Thread Bottlenecks
                      </Text>
                    </Card>
                  </div>
                </Stack>
              </Box>
            )}

            {/* ======================================================== */}
            {/* TAB 5: PROOF (Velocity & Open Source)                     */}
            {/* ======================================================== */}
            {activeTab === 'proof' && (
              <Box id="proof" className="w-full border-0 bg-transparent animate-in fade-in duration-fast">
                <Stack direction="vertical" gap="lg" className="w-full bg-transparent">
                  <div className="flex flex-col gap-1">
                    <Text variant="caption" color="brand" weight="semibold" className="uppercase tracking-widest">
                      DATA &amp; VERIFIABLE PROOF
                    </Text>
                    <Text as="h2" variant="h1" weight="bold">
                      Velocity &amp; Open Source
                    </Text>
                    <Text variant="body" color="secondary">
                      Continuous algorithmic practice and contributions to production ecosystems.
                    </Text>
                  </div>

                  <BentoGrid columns={3} className="mt-4 bg-transparent">
                    <BentoCard colSpan={2} variant="glass" className="flex flex-col gap-6">
                      <Text as="h4" variant="subheader" weight="semibold">GitHub Velocity</Text>
                      <ActivityHeatmap data={heatmapData} />
                    </BentoCard>

                    <BentoCard colSpan={1} variant="glass" className="flex flex-col items-center justify-center gap-6 text-center">
                      <ArcGauge
                        value={2000}
                        max={3000}
                        size={160}
                      />
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
            )}
          </Box>

          {/* Persistent Integrated Stage Footer */}
          <div className="mt-12 pt-6 border-t border-border-default/30 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <Stack direction="horizontal" align="center" gap="sm">
              <Text color="secondary" variant="caption">Press</Text>
              <Kbd size="sm">C</Kbd>
              <Text color="secondary" variant="caption">to copy email • Press</Text>
              <Kbd size="sm">1</Kbd>
              <Text color="secondary" variant="caption">–</Text>
              <Kbd size="sm">5</Kbd>
              <Text color="secondary" variant="caption">to switch tabs</Text>
            </Stack>

            <Stack direction="horizontal" justify="center" align={"center"} gap="sm">
              <SocialButton provider="github" size="icon" href="https://github.com/Ansh-dS" aria-label="GitHub Profile" />
              <SocialButton provider="linkedin" size="icon" href="https://www.linkedin.com/in/anshdeep-singh-a64128286/" aria-label="LinkedIn Profile" />
              <SocialButton provider="twitter" size="icon" href="https://x.com/ansh_dS_pB" aria-label="X Profile" />
            </Stack>
          </div>
        </Stack>
      </Stack>

      {/* ======================================================== */}
      {/* ACADEMIC TRANSCRIPT MODAL (IIT Patna)                    */}
      {/* ======================================================== */}
      <Modal
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        size="3xl"
      >
        <div className="flex items-center justify-center w-full max-h-[80vh] overflow-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/transcript.png"
            alt="Academic Transcript"
            className="w-full h-auto max-h-[80vh] object-contain rounded-medium"
          />
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* INTERNSHIP CERTIFICATE MODAL (Prodesk IT)                */}
      {/* ======================================================== */}
      <Modal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        size="3xl"
      >
        <div className="flex items-center justify-center w-full max-h-[80vh] overflow-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/certificate.png"
            alt="Internship Certificate"
            className="w-full h-auto max-h-[80vh] object-contain rounded-medium"
          />
        </div>
      </Modal>
    </Box>
  )
}
