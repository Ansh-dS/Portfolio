'use client'

import React from 'react'
import { Box } from '@/src/components/ui/Box/Box'
import { Text } from '@/src/components/ui/Text/Text'
import { Badge } from '@/src/components/ui/Badge/Badge'
import { Button } from '@/src/components/ui/Button/Button'
import { Avatar } from '@/src/components/ui/Avatar/Avatar'
import { GraduationCap, FileText, Zap, ArrowUpRight } from 'lucide-react'
import ansh from '@/public/ansh.jpg'

export interface HeroSectionProps {
  onSelectTab: (tab: string) => void
  onOpenTranscript: () => void
}

export function HeroSection({
  onSelectTab,
  onOpenTranscript,
}: HeroSectionProps) {
  return (
    <Box
      id="hero"
      className="w-full border-0 bg-transparent animate-in fade-in duration-fast"
    >
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16 w-full">
        {/* Left Column: Copy, Badges, CTAs */}
        <div className="flex flex-col items-start text-left w-full lg:w-3/5">
          {/* Location / Status Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-base/80 border border-border-default/50 backdrop-blur-sm mb-6 whitespace-nowrap shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse shrink-0" />
            <Text
              variant="caption"
              color="secondary"
              weight="medium"
              className="whitespace-nowrap"
            >
              Based in Delhi, India • B.Sc. CS @ IIT Patna
            </Text>
          </div>

          <Text as="h1" variant="display" weight="bold">
            Anshdeep Singh.
          </Text>

          <Text
            as="h2"
            variant="h2"
            color="brand"
            weight="medium"
            className="mt-3"
          >
            Full-Stack &amp; Founding Engineer.
          </Text>

          <Text variant="body" color="secondary" className="mt-5 max-w-[36rem]">
            Bridging complex backend architecture with zero-friction,
            high-performance UI.
          </Text>

          {/* Proof Badges */}
          <div className="flex flex-wrap gap-2.5 mt-6 w-full">
            <Badge color="info" size="sm">
              Ex-Backend Intern @ Prodesk IT, Remote
            </Badge>
            <Badge color="info" size="sm">
              Merged Contributor @ Rocket.Chat @ Excalidraw
            </Badge>
            <Badge color="info" size="sm">
              1700–2000 Leetcode Rating
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row items-center gap-4 mt-8">
            <Button
              variant="primary"
              size="md"
              onClick={() => onSelectTab('projects')}
            >
              View Projects
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onSelectTab('work')}
            >
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
            onClick={onOpenTranscript}
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
            onClick={() =>
              window.open('https://leetcode.com/u/Ansh-dS/', '_blank')
            }
            startIcon={<Zap className="size-3.5 text-amber-500" />}
            endIcon={
              <ArrowUpRight className="size-3.5 text-fg-brand opacity-70" />
            }
            className="absolute -bottom-3 -left-2 sm:-left-4 z-10"
            aria-label="Open LeetCode Profile"
          >
            400+ LeetCode
          </Button>
        </div>
      </div>
    </Box>
  )
}
