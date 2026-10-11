'use client'

import React from 'react'
import { Modal } from '@/src/components/ui/Modal/Modal'

export interface TranscriptModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TranscriptModal({ isOpen, onClose }: TranscriptModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <div className="flex items-center justify-center w-full max-h-[80vh] overflow-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/transcript.png"
          alt="Academic Transcript"
          className="w-full h-auto max-h-[80vh] object-contain rounded-medium"
        />
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
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <div className="flex items-center justify-center w-full max-h-[80vh] overflow-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/certificate.png"
          alt="Internship Certificate"
          className="w-full h-auto max-h-[80vh] object-contain rounded-medium"
        />
      </div>
    </Modal>
  )
}
