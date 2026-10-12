import React from 'react'
import { Modal } from '@/src/components/ui/Modal/Modal'
import { Button } from '@/src/components/ui/Button/Button'
import { Text } from '@/src/components/ui/Text/Text'
import { ArrowUpRight } from 'lucide-react'

export interface TranscriptModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TranscriptModal({ isOpen, onClose }: TranscriptModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      className="p-4 sm:p-6 w-[95vw] max-w-4xl"
    >
      <div className="flex flex-col gap-4 w-full">
        {/* Minimalist Top Bar */}
        <div className="flex items-center justify-between gap-4 pr-10 border-b border-border-default/30 pb-3">
          <div className="min-w-0">
            <Text
              as="h3"
              variant="h3"
              weight="bold"
              color="primary"
              className="truncate"
            >
              IIT Patna Academic Transcript
            </Text>
            <Text variant="caption" color="secondary" className="mt-0.5">
              B.Sc. in Computer Science &amp; Data Analytics • Class of 2026
            </Text>
          </div>
          <Button
            variant="glass"
            size="sm"
            onClick={() => window.open('/transcript.png', '_blank')}
            endIcon={<ArrowUpRight className="size-3.5" />}
            className="shrink-0"
            aria-label="Open original transcript in new tab"
          >
            Open in new tab
          </Button>
        </div>

        {/* Direct High-Resolution Document Canvas */}
        <div className="flex items-center justify-center w-full max-h-[75vh] overflow-auto rounded-medium border border-border-default/20 bg-surface-base/50 p-2 sm:p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/transcript.png"
            alt="IIT Patna Academic Transcript"
            className="w-full h-auto max-h-[72vh] object-contain rounded-medium shadow-sm"
          />
        </div>
      </div>
    </Modal>
  )
}

export interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CertificateModal({ isOpen, onClose }: CertificateModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      className="p-4 sm:p-6 w-[95vw] max-w-4xl"
    >
      <div className="flex flex-col gap-4 w-full">
        {/* Minimalist Top Bar */}
        <div className="flex items-center justify-between gap-4 pr-10 border-b border-border-default/30 pb-3">
          <div className="min-w-0">
            <Text
              as="h3"
              variant="h3"
              weight="bold"
              color="primary"
              className="truncate"
            >
              Certificate of Experience — Prodesk IT
            </Text>
            <Text variant="caption" color="secondary" className="mt-0.5">
              Backend Developer Intern • Verified Production Track Record
            </Text>
          </div>
          <Button
            variant="glass"
            size="sm"
            onClick={() => window.open('/prodeskIt.png', '_blank')}
            endIcon={<ArrowUpRight className="size-3.5" />}
            className="shrink-0"
            aria-label="Open original certificate in new tab"
          >
            Open in new tab
          </Button>
        </div>

        {/* Direct High-Resolution Document Canvas */}
        <div className="flex items-center justify-center w-full max-h-[75vh] overflow-auto rounded-medium border border-border-default/20 bg-surface-base/50 p-2 sm:p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/prodeskIt.png"
            alt="Prodesk IT Certificate of Experience"
            className="w-full h-auto max-h-[72vh] object-contain rounded-medium shadow-sm"
          />
        </div>
      </div>
    </Modal>
  )
}
