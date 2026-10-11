'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/src/components/ui/Utils/utils'
import { Box } from '@/src/components/ui/Box/Box'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { Badge } from '@/src/components/ui/Badge/Badge'

// ============================================================================
// LinkPreviewCard — OpenGraph-style card for rich link previews
// ============================================================================

export interface LinkPreviewCardProps
  extends React.HTMLAttributes<HTMLAnchorElement> {
  /** Target URL */
  href: string
  /** Preview image URL */
  image?: string
  /** Title text */
  title: string
  /** Description text */
  description?: string
  /** Source domain or author */
  source?: string
  /** Source favicon/icon */
  sourceIcon?: React.ReactNode
  /** Open in new tab */
  external?: boolean
}

export const LinkPreviewCard = forwardRef<HTMLAnchorElement, LinkPreviewCardProps>(
  (
    {
      href,
      image,
      title,
      description,
      source,
      sourceIcon,
      external = true,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <a
        ref={ref}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cn(
          'block no-underline group',
          'rounded-medium overflow-hidden',
          'border border-border-default bg-surface-base',
          'shadow-raised hover:shadow-overlay',
          'transition-all duration-normal',
          'hover:-translate-y-0.5',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focused',
          className
        )}
        {...rest}
      >
        {/* Preview image */}
        {image && (
          <div className="relative aspect-[2/1] overflow-hidden bg-surface-sunken">
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-normal group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <Stack direction="vertical" gap="sm" className="p-m">
          <Text as="span" variant="body" weight="semibold" color="primary" className="line-clamp-2">
            {title}
          </Text>

          {description && (
            <Text as="span" variant="caption" color="secondary" className="line-clamp-2">
              {description}
            </Text>
          )}

          {source && (
            <Stack direction="horizontal" gap="sm" align="center">
              {sourceIcon && (
                <span className="w-4 h-4 flex items-center justify-center shrink-0 text-fg-secondary">
                  {sourceIcon}
                </span>
              )}
              <Text as="span" variant="caption" color="secondary">
                {source}
              </Text>
            </Stack>
          )}
        </Stack>
      </a>
    )
  }
)
LinkPreviewCard.displayName = 'LinkPreviewCard'

// ============================================================================
// ArticleCard — Blog post / social post card with metadata strip
// ============================================================================

export interface ArticleCardProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Article URL */
  href?: string
  /** Cover image URL */
  coverImage?: string
  /** Title */
  title: string
  /** Excerpt */
  excerpt?: string
  /** Author name */
  author?: string
  /** Author avatar URL */
  authorAvatar?: string
  /** Published date string */
  date?: string
  /** Reading time */
  readTime?: string
  /** Tags / categories */
  tags?: string[]
  /** Platform source (e.g., 'X', 'LinkedIn', 'Blog') */
  platform?: string
  /** Clickable card */
  interactive?: boolean
}

export const ArticleCard = forwardRef<HTMLElement, ArticleCardProps>(
  (
    {
      href,
      coverImage,
      title,
      excerpt,
      author,
      authorAvatar,
      date,
      readTime,
      tags,
      platform,
      interactive = true,
      className,
      ...rest
    },
    ref
  ) => {
    const Wrapper = href ? 'a' : 'article'
    const wrapperProps = href
      ? { href, target: '_blank' as const, rel: 'noopener noreferrer' }
      : {}

    return (
      <Box
        ref={ref}
        as={Wrapper}
        {...wrapperProps}
        className={cn(
          'flex flex-col overflow-hidden',
          'no-underline',
          interactive && [
            'cursor-pointer',
            'hover:shadow-overlay hover:-translate-y-0.5',
            'transition-all duration-normal',
          ],
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focused',
          className
        )}
        {...rest}
      >
        {/* Cover image */}
        {coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden bg-surface-sunken">
            <img
              src={coverImage}
              alt={title}
              className={cn(
                'absolute inset-0 w-full h-full object-cover',
                interactive && 'transition-transform duration-normal hover:scale-[1.02]'
              )}
              loading="lazy"
            />
            {platform && (
              <div className="absolute top-s right-s">
                <Badge color="default" size="sm">{platform}</Badge>
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <Stack direction="vertical" gap="sm" className="p-l flex-1">
          {/* Tags */}
          {tags && tags.length > 0 && (
            <Stack direction="horizontal" gap="sm" className="flex-wrap">
              {tags.map((tag) => (
                <Badge key={tag} color="default" size="sm">{tag}</Badge>
              ))}
            </Stack>
          )}

          <Text as="span" variant="body" weight="semibold" color="primary" className="line-clamp-2">
            {title}
          </Text>

          {excerpt && (
            <Text as="span" variant="label" color="secondary" className="line-clamp-3 flex-1">
              {excerpt}
            </Text>
          )}

          {/* Meta strip */}
          <Stack direction="horizontal" gap="sm" align="center" className="mt-auto pt-s border-t border-border-default">
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={author ?? ''}
                className="w-6 h-6 rounded-pill object-cover"
                loading="lazy"
              />
            )}
            {author && (
              <Text as="span" variant="caption" weight="medium" color="primary">
                {author}
              </Text>
            )}
            {date && (
              <Text as="span" variant="caption" color="secondary">
                {date}
              </Text>
            )}
            {readTime && (
              <>
                <span className="text-fg-disabled">·</span>
                <Text as="span" variant="caption" color="secondary">
                  {readTime}
                </Text>
              </>
            )}
          </Stack>
        </Stack>
      </Box>
    )
  }
)
ArticleCard.displayName = 'ArticleCard'
