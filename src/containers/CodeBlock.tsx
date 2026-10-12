'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/src/components/ui/Utils/utils'
import { Box } from '@/src/components/ui/Box/Box'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'

// ============================================================================
// Kbd — Keyboard shortcut key cap
// ============================================================================

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  /** Size variant */
  size?: 'sm' | 'md'
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ size = 'md', className, children, ...rest }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          'font-mono',
          'bg-surface-sunken border border-border-default border-b-2 border-b-border-strong',
          'rounded-small shadow-raised',
          'text-fg-secondary',
          size === 'sm' && 'px-1 py-px text-caption min-w-[20px] h-5',
          size === 'md' && 'px-1.5 py-0.5 text-label min-w-[24px] h-6',
          className
        )}
        {...rest}
      >
        {children}
      </kbd>
    )
  }
)
Kbd.displayName = 'Kbd'

// ============================================================================
// CodeBlock — Syntax-highlighted code display
// ============================================================================

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Code string to display */
  code: string
  /** Language label shown in header */
  language?: string
  /** Filename shown in header */
  filename?: string
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Lines to highlight (1-indexed) */
  highlightLines?: number[]
  /** Show copy button */
  showCopy?: boolean
}

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code,
      language,
      filename,
      showLineNumbers = true,
      highlightLines = [],
      showCopy = true,
      className,
      ...rest
    },
    ref
  ) => {
    const lines = code.split('\n')
    const highlightSet = new Set(highlightLines)

    const handleCopy = () => {
      navigator.clipboard.writeText(code)
    }

    return (
      <Box
        ref={ref}
        className={cn(
          'overflow-hidden bg-surface-sunken border-border-default',
          'rounded-medium',
          className
        )}
        {...rest}
      >
        {/* Header bar */}
        {(filename || language) && (
          <Stack
            direction="horizontal"
            gap="sm"
            align="center"
            justify="start"
            className="px-m py-xs border-b border-border-default bg-surface-base/50"
          >
            {/* Traffic light dots */}
            <Stack
              direction="horizontal"
              gap="none"
              align="center"
              className="gap-1.5 mr-s"
            >
              <span className="w-3 h-3 rounded-pill bg-status-danger/80" />
              <span className="w-3 h-3 rounded-pill bg-status-warning/80" />
              <span className="w-3 h-3 rounded-pill bg-status-success/80" />
            </Stack>

            <Text
              as="span"
              variant="caption"
              color="secondary"
              className="font-mono flex-1"
            >
              {filename ?? language}
            </Text>

            {showCopy && (
              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  'px-xs py-0.5 rounded-small cursor-pointer',
                  'text-fg-secondary hover:text-fg-primary',
                  'hover:bg-action-ghost-hover',
                  'transition-colors duration-fast',
                  'bg-transparent border-0',
                  'focus-visible:outline-2 focus-visible:outline-border-focused'
                )}
                aria-label="Copy code"
              >
                <Text as="span" variant="caption" weight="medium">
                  Copy
                </Text>
              </button>
            )}
          </Stack>
        )}

        {/* Code body */}
        <div className="overflow-x-auto">
          <pre className="m-0 p-m text-caption leading-body font-mono">
            <code>
              {lines.map((line, i) => {
                const lineNum = i + 1
                const isHighlighted = highlightSet.has(lineNum)
                return (
                  <div
                    key={i}
                    className={cn(
                      'flex',
                      isHighlighted &&
                        'bg-action-primary-subtle/30 -mx-m px-m border-l-2 border-l-action-primary'
                    )}
                  >
                    {showLineNumbers && (
                      <span className="select-none text-fg-disabled w-8 shrink-0 text-right pr-m">
                        {lineNum}
                      </span>
                    )}
                    <span className="text-fg-primary whitespace-pre">
                      {line || ' '}
                    </span>
                  </div>
                )
              })}
            </code>
          </pre>
        </div>
      </Box>
    )
  }
)
CodeBlock.displayName = 'CodeBlock'

// ============================================================================
// TerminalWindow — Terminal emulator chrome
// ============================================================================

export interface TerminalLine {
  /** Line content */
  text: string
  /** Line type */
  type?: 'input' | 'output' | 'error' | 'comment'
  /** Prompt prefix (e.g., '$ ', '> ') */
  prompt?: string
}

export interface TerminalWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Terminal title (shown in header) */
  title?: string
  /** Lines to display */
  lines: TerminalLine[]
  /** Show blinking cursor on last input line */
  showCursor?: boolean
}

const lineColorMap = {
  input: 'text-fg-primary',
  output: 'text-fg-secondary',
  error: 'text-status-danger',
  comment: 'text-fg-disabled italic',
} as const

export const TerminalWindow = forwardRef<HTMLDivElement, TerminalWindowProps>(
  (
    { title = 'Terminal', lines, showCursor = true, className, ...rest },
    ref
  ) => {
    return (
      <Box
        ref={ref}
        className={cn(
          'overflow-hidden rounded-medium',
          'bg-[#0b0f19] border-border-strong',
          className
        )}
        {...rest}
      >
        {/* Title bar */}
        <Stack
          direction="horizontal"
          gap="sm"
          align="center"
          className="px-m py-xs border-b border-white/10"
        >
          <Stack
            direction="horizontal"
            gap="none"
            align="center"
            className="gap-1.5"
          >
            <span className="w-3 h-3 rounded-pill bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-pill bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-pill bg-[#28c840]" />
          </Stack>
          <Text
            as="span"
            variant="caption"
            className="font-mono text-[#94a3b8] flex-1 text-center"
          >
            {title}
          </Text>
          {/* Spacer for centering */}
          <div className="w-[52px]" />
        </Stack>

        {/* Terminal body */}
        <div className="p-m overflow-x-auto font-mono text-caption leading-body">
          {lines.map((line, i) => {
            const type = line.type ?? 'input'
            const prompt = line.prompt ?? (type === 'input' ? '$ ' : '')
            const isLastInput = type === 'input' && i === lines.length - 1

            return (
              <div key={i} className="flex whitespace-pre">
                {prompt && (
                  <span className="text-[#6366f1] select-none shrink-0">
                    {prompt}
                  </span>
                )}
                <span className={cn(lineColorMap[type])}>{line.text}</span>
                {showCursor && isLastInput && (
                  <span className="animate-pulse text-[#6366f1] ml-px">▊</span>
                )}
              </div>
            )
          })}
        </div>
      </Box>
    )
  }
)
TerminalWindow.displayName = 'TerminalWindow'
