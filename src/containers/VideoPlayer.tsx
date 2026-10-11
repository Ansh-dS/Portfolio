'use client'

import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { cn } from '@/src/components/ui/Utils/utils'
import { Box } from '@/src/components/ui/Box/Box'

// ============================================================================
// VideoPlayer — Auto-playing, muted, looping, borderless media
// ============================================================================

export interface VideoPlayerProps extends Omit<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  'children'
> {
  /** Video source URL */
  src: string
  /** Optional poster image shown before playback */
  poster?: string
  /** Fit mode for the video element */
  objectFit?: 'cover' | 'contain' | 'fill'
  /** Rounded corners variant */
  rounded?: 'none' | 'sm' | 'md' | 'lg'
  /** Overlay gradient for text readability */
  overlay?: boolean
  /** Aspect ratio constraint */
  aspectRatio?: '16/9' | '4/3' | '1/1' | '9/16'
  className?: string
}

const roundedMap = {
  none: 'rounded-none',
  sm: 'rounded-small',
  md: 'rounded-medium',
  lg: 'rounded-large',
} as const

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (
    {
      src,
      poster,
      objectFit = 'cover',
      rounded = 'md',
      overlay = false,
      aspectRatio = '16/9',
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <Box
        className={cn(
          'relative overflow-hidden border-0 bg-transparent shadow-none',
          roundedMap[rounded],
          className
        )}
        style={{ aspectRatio }}
      >
        <video
          ref={ref}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          className={cn(
            'absolute inset-0 w-full h-full',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill'
          )}
          {...rest}
        />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-surface-base/80 via-transparent to-transparent pointer-events-none" />
        )}
      </Box>
    )
  }
)
VideoPlayer.displayName = 'VideoPlayer'

// ============================================================================
// MediaWrapper — Container that auto-plays video or displays image
// ============================================================================

export interface MediaWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Source URL (video or image) */
  src: string
  /** Media type */
  type: 'video' | 'image'
  /** Alt text for images */
  alt?: string
  /** Aspect ratio constraint */
  aspectRatio?: '16/9' | '4/3' | '1/1' | '9/16'
  /** Rounded corners variant */
  rounded?: 'none' | 'sm' | 'md' | 'lg'
  /** Dark gradient overlay from bottom */
  overlay?: boolean
  children?: React.ReactNode
}

export const MediaWrapper = forwardRef<HTMLDivElement, MediaWrapperProps>(
  (
    {
      src,
      type,
      alt = '',
      aspectRatio = '16/9',
      rounded = 'md',
      overlay = false,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <Box
        ref={ref}
        className={cn(
          'relative overflow-hidden border-0 bg-transparent shadow-none',
          roundedMap[rounded],
          className
        )}
        style={{ aspectRatio }}
        {...rest}
      >
        {type === 'video' ? (
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        )}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-surface-base/80 via-transparent to-transparent pointer-events-none" />
        )}
        {/* Slotted content (e.g., play button overlay, caption) */}
        {children && (
          <div className="absolute inset-0 flex items-end p-m z-[1]">
            {children}
          </div>
        )}
      </Box>
    )
  }
)
MediaWrapper.displayName = 'MediaWrapper'
