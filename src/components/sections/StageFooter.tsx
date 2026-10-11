'use client'

import React from 'react'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { SocialButton } from '@/src/components/ui/SocialButton/SocialButton'
import { Kbd } from '@/src/containers'

export function StageFooter() {
  return (
    <div className="mt-12 pt-6 border-t border-border-default/30 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      <Stack direction="horizontal" align="center" gap="sm">
        <Text color="secondary" variant="caption">
          Press
        </Text>
        <Kbd size="sm">C</Kbd>
        <Text color="secondary" variant="caption">
          to copy email • Press
        </Text>
        <Kbd size="sm">1</Kbd>
        <Text color="secondary" variant="caption">
          –
        </Text>
        <Kbd size="sm">5</Kbd>
        <Text color="secondary" variant="caption">
          to switch tabs
        </Text>
      </Stack>

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
