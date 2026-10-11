'use client'

import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react'
import { Card } from '../components/ui/Card/Card'
import { Stack } from '../components/ui/Stack/Stack'
import { Badge } from '../components/ui/Badge/Badge'
import { Button } from '../components/ui/Button/Button'
import { Modal } from '../components/ui/Modal/Modal'
import { cn } from '../components/ui/Utils/utils'

import { Maximize2, Lock } from 'lucide-react'

export interface ProjectShowcaseContextType {
  isActive: boolean
}

export const ProjectShowcaseContext = React.createContext<ProjectShowcaseContextType | null>(null)

export interface AppleProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Path or URL to the walkthrough video demo */
  videoSrc?: string
  /** Minimal monospace URL label for the macOS window bar (e.g. tally.so/builder) */
  urlLabel?: string
  /** Direct interactive live deployment URL */
  liveUrl?: string
  /** Optional poster thumbnail shown while video loads */
  poster?: string
  /** Enable clicking the card to open the enhanced modal view (default: true) */
  expandable?: boolean
  isActive?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * AppleProductCard — 3D Floating Hardware Showcase
 *
 * Uses design system primitives (Card, Stack, Badge, Button, Modal) and global tokens.
 * Renders an Apple-inspired hardware frame with isometric 3D perspective,
 * intelligent viewport/hover auto-play management, and an enhanced modal viewer.
 */
export const AppleProductCard = forwardRef<HTMLDivElement, AppleProductCardProps>(
  (
    {
      videoSrc,
      urlLabel = 'project.dev/demo',
      liveUrl,
      poster,
      expandable = true,
      isActive: isActiveProp,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const cardId = React.useId()
    const containerRef = useRef<HTMLDivElement | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)

    const [hasError, setHasError] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isInView, setIsInView] = useState(false)

    // Synchronize with parent ProjectShowcaseRow context if present
    const showcaseContext = React.useContext(ProjectShowcaseContext)
    const isControlled = isActiveProp !== undefined || showcaseContext !== null
    const effectiveIsActive = isActiveProp ?? showcaseContext?.isActive ?? isInView

    // Forward ref integration
    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    // Viewport-aware auto-play fallback for standalone cards
    useEffect(() => {
      if (isControlled) return
      const element = containerRef.current
      if (!element || typeof IntersectionObserver === 'undefined') return

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry) {
            setIsInView(entry.isIntersecting)
          }
        },
        {
          rootMargin: '-5% 0px -8% 0px',
          threshold: 0.25,
        }
      )

      observer.observe(element)
      return () => observer.disconnect()
    }, [isControlled])

    // Mutual exclusion: when any video starts playing, pause all other card videos immediately
    useEffect(() => {
      const handleOtherPlay = (e: Event) => {
        const customEvent = e as CustomEvent<{ cardId: string }>
        if (customEvent.detail?.cardId !== cardId) {
          videoRef.current?.pause()
        }
      }

      window.addEventListener('apple-video-play', handleOtherPlay)
      return () => window.removeEventListener('apple-video-play', handleOtherPlay)
    }, [cardId])

    // Synchronize video playback with viewport visibility and modal status
    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      const shouldPlay = effectiveIsActive && !isModalOpen

      if (shouldPlay) {
        window.dispatchEvent(
          new CustomEvent('apple-video-play', { detail: { cardId } })
        )
        video.play().catch(() => {
          // Gracefully ignore auto-play promise rejections
        })
      } else {
        video.pause()
      }
    }, [effectiveIsActive, isModalOpen, cardId])

    return (
      <>
        <div
          ref={containerRef}
          onClick={() => {
            if (expandable) setIsModalOpen(true)
          }}
          onMouseEnter={() => {
            const video = videoRef.current
            if (video && video.paused) {
              video.play().catch(() => {})
            }
          }}
          className={cn(
            'group relative w-full flex items-center justify-center [perspective:1200px] transition-all duration-normal',
            effectiveIsActive
              ? 'opacity-100 scale-100'
              : 'opacity-70 blur-[0.5px] scale-[0.99]',
            expandable && 'cursor-pointer',
            className
          )}
          role={expandable ? 'button' : undefined}
          tabIndex={expandable ? 0 : undefined}
          onKeyDown={(e) => {
            if (expandable && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              setIsModalOpen(true)
            }
          }}
          aria-label={expandable ? `Expand ${urlLabel} showcase demo` : undefined}
          {...rest}
        >
          {/* Ambient Backlight Rim Glow */}
          <div
            aria-hidden="true"
            className={cn(
              'absolute -inset-6 rounded-large bg-gradient-to-tr from-action-primary/10 via-action-primary/5 to-transparent blur-2xl transition-all duration-normal pointer-events-none',
              effectiveIsActive ? 'opacity-25' : 'opacity-10',
              'group-hover:opacity-40 group-active:opacity-15 group-active:scale-95'
            )}
          />

          {/* 3D Floating Hardware Chassis */}
          <Card
            variant="glass"
            padding="none"
            elevation="lg"
            className={cn(
              'w-full transform-gpu will-change-transform duration-slow transition-transform select-none',
              '[transform:perspective(1200px)_rotateY(-7deg)_rotateX(4deg)_scale(0.97)]',
              'group-hover:[transform:perspective(1200px)_rotateY(0deg)_rotateX(0deg)_scale(1.01)]',
              'group-active:[transform:perspective(1200px)_rotateY(0deg)_rotateX(0deg)_scale(0.95)] group-active:duration-fast'
            )}
          >
            {/* macOS Window Chrome Header */}
            <Stack
              direction="horizontal"
              justify="between"
              align="center"
              className="px-m py-s bg-surface-sunken/60 border-b border-border-default/50 select-none z-10 w-full"
            >
              {/* Window Traffic Lights */}
              <Stack direction="horizontal" gap="sm" align="center" className="shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-status-danger" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-warning" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-success" />
              </Stack>

              {/* Address Pill */}
              {urlLabel && (
                <Badge
                  color="default"
                  size="sm"
                  startIcon={<span className="text-[10px] opacity-70">🔒</span>}
                  className="font-mono max-w-[60%]"
                >
                  {urlLabel}
                </Badge>
              )}

              {/* Expand Indicator (in the same row where traffic lights show up) */}
              <div className="w-12 shrink-0 flex justify-end items-center pointer-events-none">
                {expandable && (
                  <span
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-normal text-fg-secondary group-hover:text-fg-brand"
                    aria-hidden="true"
                  >
                    <Maximize2 className="size-3.5" />
                  </span>
                )}
              </div>
            </Stack>

            {/* Video or Fallback Content Display */}
            <div className="relative aspect-video w-full bg-surface-sunken/80 overflow-hidden flex items-center justify-center">
              {videoSrc && !hasError ? (
                <video
                  ref={videoRef}
                  poster={poster}
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onError={() => setHasError(true)}
                  className="w-full h-full object-cover pointer-events-none"
                >
                  <source src={videoSrc.replace(/\.mov$/, '.mp4')} type="video/mp4" />
                  <source src={videoSrc} type="video/quicktime" />
                  <source src={videoSrc} />
                </video>
              ) : (
                children
              )}
            </div>
          </Card>
        </div>

        {/* Enhanced Version: Modal Presentation with the Same AppleProductCard Frame */}
        {expandable && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            size="3xl"
            className="max-w-5xl p-0 bg-transparent border-0 shadow-none overflow-visible [&>button:last-child]:hidden"
          >
            <div className="relative w-full flex items-center justify-center p-2 sm:p-4">
              {/* Enhanced Ambient Backlight Rim Glow */}
              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-large bg-gradient-to-tr from-action-primary/15 via-action-primary/10 to-transparent blur-3xl opacity-35 pointer-events-none"
              />

              {/* Full Hardware Frame */}
              <Card
                variant="glass"
                padding="none"
                elevation="lg"
                className="w-full border border-border-default/60 shadow-modal overflow-hidden bg-surface-overlay/95 backdrop-blur-xl"
              >
                {/* macOS Window Chrome Header */}
                <Stack
                  direction="horizontal"
                  justify="between"
                  align="center"
                  className="px-m py-s bg-surface-sunken/80 border-b border-border-default/60 select-none z-10 w-full"
                >
                  {/* Interactive Window Traffic Lights (Red dot acts as close button) */}
                  <Stack direction="horizontal" gap="sm" align="center" className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="group/close relative w-3 h-3 rounded-full bg-status-danger flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-status-danger cursor-pointer"
                      aria-label="Close demo modal"
                      title="Close"
                    >
                      <span className="opacity-0 group-hover/close:opacity-100 text-[9px] font-bold text-black leading-none select-none">
                        ×
                      </span>
                    </button>
                    <span className="w-3 h-3 rounded-full bg-status-warning" />
                    <span className="w-3 h-3 rounded-full bg-status-success" />
                  </Stack>

                  {/* Address Pill */}
                  {urlLabel && (
                    <Badge
                      color="default"
                      size="sm"
                      startIcon={<span className="text-[10px] opacity-70">🔒</span>}
                      className="font-mono max-w-[60%] px-3"
                    >
                      {urlLabel}
                    </Badge>
                  )}

                  {/* Esc / Close Shortcut Pill & Try Live */}
                  <Stack direction="horizontal" gap="sm" align="center" className="shrink-0">
                    {liveUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(liveUrl, '_blank')}
                        endIcon={<span className="text-xs opacity-70">↗</span>}
                        aria-label="Open live project"
                      >
                        Try Live
                      </Button>
                    )}
                  </Stack>
                </Stack>

                {/* Enhanced Video Viewport with Full Player Controls */}
                <div className="relative aspect-video w-full bg-black/95 overflow-hidden flex items-center justify-center">
                  {videoSrc && !hasError ? (
                    <video
                      poster={poster}
                      autoPlay
                      controls
                      loop
                      playsInline
                      className="w-full h-full object-contain"
                    >
                      <source src={videoSrc.replace(/\.mov$/, '.mp4')} type="video/mp4" />
                      <source src={videoSrc} type="video/quicktime" />
                      <source src={videoSrc} />
                    </video>
                  ) : (
                    children
                  )}
                </div>
              </Card>
            </div>
          </Modal>
        )}
      </>
    )
  }
)

AppleProductCard.displayName = 'AppleProductCard'
