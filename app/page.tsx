'use client'

import React, { useState, useEffect } from 'react'
import { Box } from '@/src/components/ui/Box/Box'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { DotPattern } from '@/src/components/ui/DotPattern/DotPattern'
import { Tabs, TabsList, TabsTrigger } from '@/src/components/ui/Tabs/Tabs'
import { ThemeToggle } from '@/src/containers'
import {
  HeroSection,
  WorkSection,
  ProjectsSection,
  ArchitectureSection,
  ProofSection,
  StageFooter,
  TranscriptModal,
  CertificateModal,
} from '@/src/components/sections'

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'proof', label: 'Proof' },
] as const

export default function Home() {
  const [activeTab, setActiveTab] = useState('hero')
  const [copied, setCopied] = useState(false)
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)
  const [isCertificateOpen, setIsCertificateOpen] = useState(false)

  // Global keybindings: 'C' to copy email, numbers 1-5 to switch tabs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) {
        navigator.clipboard.writeText('ansh.dev.engg@gmail.com')
        setCopied(true)
        setTimeout(() => setCopied(false), 2200)
      } else if (e.key >= '1' && e.key <= '5') {
        const index = parseInt(e.key, 10) - 1
        if (NAV_ITEMS[index]) {
          setActiveTab(NAV_ITEMS[index].id)
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
            <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse" />
            <Text variant="caption" weight="medium" color="primary">
              Copied email (ansh.dev.engg@gmail.com) to clipboard!
            </Text>
          </div>
        </div>
      )}

      {/* Persistent Floating Bottom Navigation Dock */}
      <Tabs
        value={activeTab}
        onTabChange={setActiveTab}
        variant="glass"
        size="md"
        className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-toast shadow-modal max-w-[95vw] bg-surface-raised/30 rounded-large"
      >
        <TabsList className="items-center">
          <ThemeToggle size="sm" />
          {NAV_ITEMS.map((item) => (
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
            {activeTab === 'hero' && (
              <HeroSection
                onSelectTab={setActiveTab}
                onOpenTranscript={() => setIsTranscriptOpen(true)}
              />
            )}

            {activeTab === 'work' && (
              <WorkSection
                onOpenCertificate={() => setIsCertificateOpen(true)}
              />
            )}

            {activeTab === 'projects' && <ProjectsSection />}

            {activeTab === 'architecture' && <ArchitectureSection />}

            {activeTab === 'proof' && <ProofSection />}
          </Box>

          {/* Persistent Integrated Stage Footer */}
          <StageFooter />
        </Stack>
      </Stack>

      {/* Modals */}
      <TranscriptModal
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
      />
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />
    </Box>
  )
}