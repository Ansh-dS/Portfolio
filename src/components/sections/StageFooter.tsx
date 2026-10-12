'use client'

import React from 'react'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { SocialButton } from '@/src/components/ui/SocialButton/SocialButton'
import { Kbd } from '@/src/containers'

export function StageFooter() {
  return (
    <div className="mt-12 pt-6 border-t border-border-default/30 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      {/* Desktop Single-Line Shortcut Hints */}
      <div className="hidden sm:flex items-center gap-1.5">
        <Text color="secondary" variant="caption">
          Press
        </Text>
        <Kbd size="sm">C</Kbd>
        <Text color="secondary" variant="caption">
          to copy email
        </Text>
        <Text color="secondary" variant="caption" className="mx-1">
          •
        </Text>
        <Text color="secondary" variant="caption">
          Press
        </Text>
        <Kbd size="sm">1</Kbd>
        <Text color="secondary" variant="caption">
          –
        </Text>
        <Kbd size="sm">5</Kbd>
        <Text color="secondary" variant="caption">
          to switch tabs
        </Text>
      </div>

      {/* Mobile Clean 2-Line Shortcut Hints */}
      <div className="flex sm:hidden flex-col items-center gap-1 text-center">
        <div className="flex items-center gap-1.5">
          <Text color="secondary" variant="caption">
            Press
          </Text>
          <Kbd size="sm">C</Kbd>
          <Text color="secondary" variant="caption">
            to copy email
          </Text>
        </div>
        <div className="flex items-center gap-1.5">
          <Text color="secondary" variant="caption">
            Press
          </Text>
          <Kbd size="sm">1</Kbd>
          <Text color="secondary" variant="caption">
            –
          </Text>
          <Kbd size="sm">5</Kbd>
          <Text color="secondary" variant="caption">
            to switch tabs
          </Text>
        </div>
      </div>

      <Stack direction="horizontal" justify="center" align="center" gap="sm">
        <SocialButton
          provider="github"
          size="icon"
          href="https://github.com/Ansh-dS"
          aria-label="GitHub Profile"
        />
        <SocialButton
          provider="linkedin"
          size="icon"
          href="https://www.linkedin.com/in/anshdeep-singh-a64128286/"
          aria-label="LinkedIn Profile"
        />
        <SocialButton
          provider="twitter"
          size="icon"
          href="https://x.com/ansh_dS_pB"
          aria-label="X Profile"
        />
      </Stack>
    </div>
  )
}
