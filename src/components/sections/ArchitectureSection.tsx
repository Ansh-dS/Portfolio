'use client'

import React, { useState, useCallback } from 'react'
import { Box } from '@/src/components/ui/Box/Box'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { Badge } from '@/src/components/ui/Badge/Badge'
import { Button } from '@/src/components/ui/Button/Button'
import { Modal } from '@/src/components/ui/Modal/Modal'
import { ProjectShowcaseGroup, ProjectShowcaseRow } from '@/src/containers'
import { ArrowUpRight, Maximize2 } from 'lucide-react'

// ============================================================================
// Types & Contracts
// ============================================================================

export interface ArchitectureHighlight {
  label: string
  text: string
}

export interface ArchitectureItem {
  id: string
  kicker: string
  title: string
  fileLabel: string
  problem: string
  highlights: ArchitectureHighlight[]
  diagramImage: string
  tags: string[]
  date: string
  readTime: string
  twitterUrl: string
  linkedinUrl: string
}

export interface DiagramPreview {
  title: string
  image: string
}

export interface ArchitectureSectionProps {
  items?: ArchitectureItem[]
}

// ============================================================================
// Data
// ============================================================================

export const ARCHITECTURE_ITEMS: ArchitectureItem[] = [
  {
    id: 'postgres-autosave-write-buffer',
    kicker: 'ASYNC WRITE PIPELINE & DB PROTECTION',
    title:
      'Writing to Postgres on every client keystroke is a great way to take down your production database',
    fileLabel: 'postgres.write/autosave-buffer-pipeline.excalidraw',
    problem:
      'Direct writes on keystrokes cause connection pool exhaustion and IOPS spikes. We buffer mutations at the API layer and treat Postgres writes as an asynchronous background job.',
    highlights: [
      {
        label: '01 // CLIENT DEBOUNCE',
        text: '5-second client debounce via Zustand store batches local mutations before firing requests.',
      },
      {
        label: '02 // IN-MEMORY BUFFER',
        text: 'Stateless API schema validation dumps drafts directly into Redis (24h TTL) in sub-milliseconds.',
      },
      {
        label: '03 // ASYNC WORKER DRAIN',
        text: 'Background BullMQ worker drains the queue and executes batched, canonical writes to Postgres.',
      },
    ],
    diagramImage: '/diagram_postgres_autosave.png',
    tags: [
      'PostgreSQL',
      'Redis',
      'BullMQ',
      'Zustand',
      'Performance',
      'Node.js',
    ],
    date: 'Oct 2026',
    readTime: '5 min read',
    twitterUrl: 'https://x.com/ansh_dS_pB/status/2103784423888200049?s=20',
    linkedinUrl: 'https://lnkd.in/p/gftPCpMX',
  },
  {
    id: 'google-oauth-zero-trust',
    kicker: 'ZERO-TRUST AUTH & CALLBACK VALIDATION',
    title:
      'Never trust frontend Google OAuth payloads. The zero-trust callback architecture',
    fileLabel: 'auth.service/google-oauth-zero-trust.excalidraw',
    problem:
      'Trusting client-supplied profile payloads allows attackers to spoof emails and hijack accounts. We enforce a zero-trust callback pipeline with cryptographic verification.',
    highlights: [
      {
        label: '01 // CSRF NONCE VALIDATION',
        text: 'Mitigates CSRF by minting a 16-byte nonce in an httpOnly cookie, validated against the OAuth state param.',
      },
      {
        label: '02 // SERVER TOKEN EXCHANGE',
        text: 'Server-side code exchange with Google API ensures the backend receives and validates the raw id_token.',
      },
      {
        label: '03 // AUDIENCE & SIG VERIFY',
        text: 'Atomic Postgres upsert validates audience (aud) and signature before minting first-party session cookies.',
      },
    ],
    diagramImage: '/diagram_oauth.png',
    tags: [
      'Google OAuth',
      'Zero-Trust',
      'CSRF Nonce',
      'PostgreSQL',
      'Security',
      'Next.js 15',
    ],
    date: 'Oct 2026',
    readTime: '6 min read',
    twitterUrl: 'https://x.com/ansh_dS_pB/status/2105565893099159680?s=20',
    linkedinUrl: 'https://lnkd.in/p/gXFPFpkr',
  },
  {
    id: 'jwt-silent-token-rotation',
    kicker: 'SESSION RESILIENCY & RETRY ENGINE',
    title:
      "15-min JWT expiry shouldn't break user flow. Here is how silent token rotation actually works",
    fileLabel: 'session.worker/silent-token-rotation.excalidraw',
    problem:
      'Short-lived access tokens protect APIs but hurt user experience when sessions expire abruptly. We decouple expiration from the UI using transparent interceptors and silent rotation.',
    highlights: [
      {
        label: '01 // MIDDLEWARE INTERCEPT',
        text: 'Middleware intercepts expired access tokens without throwing disruptive 401 errors to the user.',
      },
      {
        label: '02 // CRYPTOGRAPHIC AUDIT',
        text: 'Cryptographic signature validation and active DB session checks ensure revoked devices cannot refresh.',
      },
      {
        label: '03 // SEAMLESS REPLAY',
        text: 'API mints a fresh access token and automatically replays the original in-flight request seamlessly.',
      },
    ],
    diagramImage: '/diagram_jwt.png',
    tags: [
      'JWT Rotation',
      'Auth Middleware',
      'Axios Interceptor',
      'Next.js 15',
      'Web Security',
    ],
    date: 'Sep 2026',
    readTime: '🧵 8 tweets',
    twitterUrl: 'https://x.com/ansh_dS_pB/status/2105256945297088516?s=20',
    linkedinUrl: 'https://lnkd.in/p/g9CbUTbm',
  },
]

// ============================================================================
// Utilities & Icons
// ============================================================================

const openExternalLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const TwitterIcon = ({ className = 'size-3.5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const LinkedInIcon = ({ className = 'size-3.5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2" />
  </svg>
)

// ============================================================================
// Subcomponents
// ============================================================================

interface ArchitectureCanvasProps {
  item: ArchitectureItem
  onExpand: () => void
}

function ArchitectureCanvas({ item, onExpand }: ArchitectureCanvasProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onExpand()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Enlarge system architecture diagram for ${item.title}`}
      className="group relative w-full sm:-mx-3 md:-mx-5 sm:w-[calc(100%+1.5rem)] md:w-[calc(100%+2.5rem)] rounded-large border border-border-default bg-surface-base overflow-hidden shadow-modal hover:shadow-overlay transition-all duration-normal ease-out hover:scale-[1.01] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focused"
      onClick={onExpand}
      onKeyDown={handleKeyDown}
    >
      {/* macOS Window Chrome Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-default bg-surface-sunken/80 backdrop-blur-sm">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-pill bg-status-danger" />
          <span className="size-2.5 rounded-pill bg-status-warning" />
          <span className="size-2.5 rounded-pill bg-status-success" />
        </div>
        <Text
          as="span"
          variant="caption"
          color="secondary"
          className="truncate max-w-xs sm:max-w-md"
        >
          {item.fileLabel}
        </Text>
        <div
          className="flex items-center text-fg-secondary group-hover:text-fg-brand transition-colors"
          aria-hidden="true"
        >
          <Maximize2 className="size-3.5" />
        </div>
      </div>

      {/* Studio Diagram Surface */}
      <div className="p-2 sm:p-4 md:p-6 flex items-center justify-center bg-surface-sunken/30 min-h-[280px] sm:min-h-[380px] md:min-h-[450px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.diagramImage}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="w-full h-auto max-h-[380px] sm:max-h-[460px] md:max-h-[520px] object-contain transition-transform duration-normal ease-out"
        />
      </div>
    </div>
  )
}

interface ArchitectureContentProps {
  item: ArchitectureItem
}

function ArchitectureContent({ item }: ArchitectureContentProps) {
  return (
    <div className="flex flex-col gap-4 w-full px-2 sm:px-5 md:px-7">
      {/* Title & Actions Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <Text
            variant="caption"
            color="brand"
            weight="semibold"
            className="uppercase tracking-wider"
          >
            {item.kicker}
          </Text>
          <Text
            as="h3"
            variant="h2"
            weight="bold"
            color="primary"
            className="mt-1"
          >
            {item.title}
          </Text>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <Button
            variant="glass"
            size="sm"
            onClick={() => openExternalLink(item.twitterUrl)}
            startIcon={<TwitterIcon className="size-3.5 fill-current" />}
            endIcon={<ArrowUpRight className="size-3 opacity-60" />}
            aria-label={`Read ${item.title} thread on X / Twitter`}
          >
            Thread
          </Button>
          <Button
            variant="glass"
            size="sm"
            onClick={() => openExternalLink(item.linkedinUrl)}
            startIcon={
              <LinkedInIcon className="size-3.5 fill-current text-status-info" />
            }
            endIcon={<ArrowUpRight className="size-3 opacity-60" />}
            aria-label={`Read ${item.title} post on LinkedIn`}
          >
            Post
          </Button>
        </div>
      </div>

      {/* Problem Context Lead Paragraph */}
      <Text variant="body" color="secondary">
        {item.problem}
      </Text>

      {/* 3-Column Architectural Guarantees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {item.highlights.map((highlight) => (
          <div
            key={highlight.label}
            className="p-3.5 rounded-medium bg-surface-sunken/40 border border-border-default flex flex-col gap-1.5"
          >
            <Text
              as="span"
              variant="caption"
              color="brand"
              weight="medium"
              className="font-mono uppercase tracking-wider"
            >
              {highlight.label}
            </Text>
            <Text variant="caption" color="secondary">
              {highlight.text}
            </Text>
          </div>
        ))}
      </div>

      {/* Metadata & Minimalist Technology Tags */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {item.tags.map((tag) => (
            <Badge key={tag} size="sm" color="info">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Text as="span" variant="caption" color="secondary">
            {item.date}
          </Text>
          <Text as="span" variant="caption" color="secondary">
            •
          </Text>
          <Text as="span" variant="caption" color="secondary">
            {item.readTime}
          </Text>
        </div>
      </div>
    </div>
  )
}

interface ArchitectureCardProps {
  item: ArchitectureItem
  onExpandDiagram: (preview: DiagramPreview) => void
}

function ArchitectureCard({ item, onExpandDiagram }: ArchitectureCardProps) {
  const handleExpand = () => {
    onExpandDiagram({
      title: item.title,
      image: item.diagramImage,
    })
  }

  return (
    <ProjectShowcaseRow className="flex flex-col gap-6 sm:py-20 w-full">
      <ArchitectureCanvas item={item} onExpand={handleExpand} />
      <ArchitectureContent item={item} />
    </ProjectShowcaseRow>
  )
}

interface ArchitectureModalProps {
  selectedDiagram: DiagramPreview | null
  onClose: () => void
}

function ArchitectureModal({
  selectedDiagram,
  onClose,
}: ArchitectureModalProps) {
  if (!selectedDiagram) return null

  return (
    <Modal
      isOpen={Boolean(selectedDiagram)}
      onClose={onClose}
      size="4xl"
      className="p-4 sm:p-6 w-[95vw] max-w-5xl"
    >
      <div className="flex flex-col gap-4 w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 pr-10 border-b border-border-default pb-3">
          <div className="min-w-0">
            <Text
              as="h3"
              variant="h3"
              weight="bold"
              color="primary"
              className="truncate"
            >
              {selectedDiagram.title}
            </Text>
            <Text variant="caption" color="secondary" className="mt-0.5">
              High-Resolution Architecture Flow • Primary System Specification
            </Text>
          </div>
          <Button
            variant="glass"
            size="sm"
            onClick={() => openExternalLink(selectedDiagram.image)}
            endIcon={<ArrowUpRight className="size-3.5" />}
            className="shrink-0"
            aria-label="Open original architecture diagram in new tab"
          >
            Open in new tab
          </Button>
        </div>

        {/* High-Resolution Diagram Display */}
        <div className="flex items-center justify-center w-full max-h-[75vh] overflow-auto rounded-medium border border-border-default bg-surface-sunken p-4 sm:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedDiagram.image}
            alt={selectedDiagram.title}
            loading="lazy"
            decoding="async"
            className="w-full h-auto max-h-[72vh] object-contain rounded-small"
          />
        </div>
      </div>
    </Modal>
  )
}

// ============================================================================
// Main Section Component
// ============================================================================

export function ArchitectureSection({
  items = ARCHITECTURE_ITEMS,
}: ArchitectureSectionProps) {
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramPreview | null>(
    null
  )

  const handleCloseModal = useCallback(() => {
    setSelectedDiagram(null)
  }, [])

  return (
    <Box
      id="architecture"
      className="w-full border-0 bg-transparent animate-in fade-in duration-fast"
    >
      <Stack direction="vertical" gap="lg" className="w-full">
        {/* Section Header */}
        <div className="flex flex-col gap-1">
          <Text
            variant="caption"
            color="brand"
            weight="semibold"
            className="uppercase tracking-widest"
          >
            SYSTEM DESIGN &amp; ARCHITECTURE
          </Text>
          <Text as="h2" variant="h1" weight="bold">
            System Architecture
          </Text>
          <Text variant="body" color="secondary">
            Deep dives on database write buffers, zero-trust OAuth callbacks,
            and silent JWT session hydration.
          </Text>
        </div>

        {/* Full-Width Architecture Showcase Group */}
        <ProjectShowcaseGroup variant="posts" className="w-full mt-6">
          <Stack direction="vertical" gap="none" className="w-full pb-28">
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <ArchitectureCard
                  item={item}
                  onExpandDiagram={setSelectedDiagram}
                />

                {index < items.length - 1 && (
                  <div
                    className="w-full h-px bg-gradient-to-r from-transparent via-border-default to-transparent my-10 sm:my-16"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            ))}
          </Stack>
        </ProjectShowcaseGroup>
      </Stack>

      {/* Lightbox Modal */}
      <ArchitectureModal
        selectedDiagram={selectedDiagram}
        onClose={handleCloseModal}
      />
    </Box>
  )
}
