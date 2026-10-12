'use client'

import React, { useState } from 'react'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { SocialButton } from '@/src/components/ui/SocialButton/SocialButton'
import { showToast } from '@/src/components/ui/ToastProvider/ToastProvider'
import { Kbd } from '@/src/components/ui/Kbd/Kbd'
import { Mail, Phone } from 'lucide-react'

const EMAIL_ADDRESS = 'ansh.dev.engg@gmail.com'
export const PHONE_NUMBER = '+91 99908 80213'

export function StageFooter() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL_ADDRESS)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 1500)
    showToast({
      intent: 'success',
      title: 'Email Copied!',
      description: `${EMAIL_ADDRESS} copied to clipboard.`,
      variant: 'glass',
    })
  }

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PHONE_NUMBER)
    setCopiedPhone(true)
    setTimeout(() => setCopiedPhone(false), 1500)
    showToast({
      intent: 'success',
      title: 'Phone Number Copied!',
      description: `${PHONE_NUMBER} copied to clipboard.`,
      variant: 'glass',
    })
  }

  const iconButtonClass =
    'w-9 h-9 min-w-9 min-h-9 p-0 aspect-square rounded-medium shrink-0 bg-fg-primary text-fg-inverted border border-transparent hover:opacity-90 active:scale-[0.98] inline-flex items-center justify-center cursor-pointer shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-border-focused transition-all duration-fast'

  return (
    <div className="mt-12 pt-6 border-t border-border-default/30 flex flex-col md:flex-row items-center justify-between gap-4 w-full">
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

      {/* Mobile Clean Shortcut Hints */}
      <div className="flex sm:hidden flex-col items-center gap-1 text-center">
        <div className="flex items-center gap-1.5">
          <Text color="secondary" variant="caption">
            Press
          </Text>
          <Kbd size="sm">C</Kbd>
          <Text color="secondary" variant="caption">
            to copy email •
          </Text>
          <Kbd size="sm">1</Kbd>
          <Text color="secondary" variant="caption">
            –
          </Text>
          <Kbd size="sm">5</Kbd>
          <Text color="secondary" variant="caption">
            tabs
          </Text>
        </div>
      </div>

      {/* Action Row: Optimal Recruiter & Founder Hierarchy:
          1. GitHub (Code Verification)
          2. LinkedIn (Background & Career)
          3. Email (Primary Inbound Outreach)
          4. Phone (Direct Call / WhatsApp)
          5. X (Social & Tech Presence)
      */}
      <Stack direction="horizontal" justify="center" align="center" gap="sm">
        {/* 1. GitHub */}
        <SocialButton
          provider="github"
          size="icon"
          href="https://github.com/Ansh-dS"
          aria-label="GitHub Profile"
          title="GitHub Profile (@Ansh-dS)"
        />

        {/* 2. LinkedIn */}
        <SocialButton
          provider="linkedin"
          size="icon"
          href="https://www.linkedin.com/in/anshdeep-singh-a64128286/"
          aria-label="LinkedIn Profile"
          title="LinkedIn Profile"
        />

        {/* 3. Email (Click to Copy) */}
        <button
          type="button"
          onClick={handleCopyEmail}
          aria-label={`Copy email: ${EMAIL_ADDRESS}`}
          title={`Copy email (${EMAIL_ADDRESS})`}
          className={iconButtonClass}
        >
          {copiedEmail ? (
            <span className="text-[11px] font-bold">✓</span>
          ) : (
            <Mail className="size-4.5" />
          )}
        </button>

        {/* 4. Phone (Click to Copy) */}
        <button
          type="button"
          onClick={handleCopyPhone}
          aria-label={`Copy phone: ${PHONE_NUMBER}`}
          title={`Copy phone (${PHONE_NUMBER})`}
          className={iconButtonClass}
        >
          {copiedPhone ? (
            <span className="text-[11px] font-bold">✓</span>
          ) : (
            <Phone className="size-4.5" />
          )}
        </button>

        {/* 5. X / Twitter */}
        <SocialButton
          provider="twitter"
          size="icon"
          href="https://x.com/ansh_dS_pB"
          aria-label="X Profile"
          title="X Profile (@ansh_dS_pB)"
        />
      </Stack>
    </div>
  )
}
