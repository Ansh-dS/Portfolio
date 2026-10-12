'use client'

import React, { useState, useEffect } from 'react'
import { Box } from '@/src/components/ui/Box/Box'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { DotPattern } from '@/src/components/ui/DotPattern/DotPattern'
import { Tabs, TabsList, TabsTrigger } from '@/src/components/ui/Tabs/Tabs'
import { ThemeToggle } from '@/src/containers'
import { showToast } from '@/src/components/ui/ToastProvider/ToastProvider'
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
  { id: 'hero', label: 'Home', shortLabel: 'Home' },
  { id: 'work', label: 'Work', shortLabel: 'Work' },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects' },
  { id: 'architecture', label: 'Architecture', shortLabel: 'Arch' },
  { id: 'proof', label: 'Proof', shortLabel: 'Proof' },
] as const

export default function Home() {
  const [activeTab, setActiveTab] = useState('hero')
  const [proofSubTab, setProofSubTab] = useState<
    'activity' | 'contributions'
  >('activity')
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)
  const [isCertificateOpen, setIsCertificateOpen] = useState(false)

  const handleSelectTab = (
    tab: string,
    subTab?: 'activity' | 'contributions'
  ) => {
    setActiveTab(tab)
    if (subTab) {
      setProofSubTab(subTab)
    }
  }

  // Global keybindings: 'C' to copy email, numbers 1-5 to switch tabs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName))
        return

      if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) {
        navigator.clipboard.writeText('ansh.dev.engg@gmail.com')
        showToast({
          intent: 'success',
          title: 'Email Copied!',
          description: 'ansh.dev.engg@gmail.com copied to clipboard.',
          variant: 'glass',
        })
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

      {/* Persistent Floating Bottom Navigation Dock */}
      <Tabs
        value={activeTab}
        onTabChange={setActiveTab}
        variant="glass"
        size="md"
        className="fixed bottom-3 sm:bottom-8 left-1/2 -translate-x-1/2 z-toast shadow-modal max-w-[96vw] bg-surface-raised/30 rounded-large overflow-x-auto scrollbar-hide"
      >
        <TabsList className="items-center px-1 py-1 gap-1 flex-nowrap">
          <ThemeToggle size="sm" className="shrink-0" />
          {NAV_ITEMS.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="shrink-0 whitespace-nowrap"
            >
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.shortLabel}</span>
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
                onSelectTab={handleSelectTab}
                onOpenTranscript={() => setIsTranscriptOpen(true)}
                onOpenCertificate={() => setIsCertificateOpen(true)}
              />
            )}

            {activeTab === 'work' && (
              <WorkSection
                onOpenCertificate={() => setIsCertificateOpen(true)}
              />
            )}

            {activeTab === 'projects' && <ProjectsSection />}

            {activeTab === 'architecture' && <ArchitectureSection />}

            {activeTab === 'proof' && (
              <ProofSection
                subTab={proofSubTab}
                onSubTabChange={setProofSubTab}
              />
            )}
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