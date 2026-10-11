'use client'

import React from 'react'
import { Box } from '@/src/components/ui/Box/Box'
import { Stack } from '@/src/components/ui/Stack/Stack'
import { Text } from '@/src/components/ui/Text/Text'
import { Badge } from '@/src/components/ui/Badge/Badge'
import { Button } from '@/src/components/ui/Button/Button'
import { Card } from '@/src/components/ui/Card/Card'
import { Award } from 'lucide-react'

export interface WorkSectionProps {
  onOpenCertificate: () => void
}

export function WorkSection({ onOpenCertificate }: WorkSectionProps) {
  return (
    <Box
      id="work"
      className="w-full border-0 bg-transparent animate-in fade-in duration-fast"
    >
      <Stack direction="vertical" gap="lg" className="w-full">
        <div className="flex flex-col gap-1">
          <Text
            variant="caption"
            color="brand"
            weight="semibold"
            className="uppercase tracking-widest"
          >
            EXPERIENCE &amp; IMPACT
          </Text>
          <Text as="h2" variant="h1" weight="bold">
            Production Track Record
          </Text>
          <Text variant="body" color="secondary">
            Engineering reliable REST microservices and database query
            optimization.
          </Text>
        </div>

        <Card variant="outlined" padding="lg" className="mt-4 border-0">
          <Stack direction="vertical" gap="md" className="border-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-default/40 pb-4 w-full">
              <div>
                <Text as="h3" variant="h3" weight="bold">
                  Backend Developer Intern
                </Text>
                <Text variant="label" color="brand" weight="medium">
                  @ Prodesk IT
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <Badge color="info" size="sm" className="w-fit">
                  Remote • Summer 2025
                </Badge>
                <Button
                  variant="glass"
                  size="sm"
                  startIcon={<Award className="size-3.5" />}
                  onClick={onOpenCertificate}
                  aria-label="View Internship Certificate"
                >
                  Certificate
                </Button>
              </div>
            </div>

            <Text variant="body" color="secondary">
              Engineered type-safe RESTful APIs, optimized PostgreSQL query
              plans for low-latency joins, and containerized microservices via
              Docker for automated deployment pipelines.
            </Text>
            <Stack direction="horizontal" gap="sm" className="flex-wrap mt-2">
              <Badge color="brand">Node.js</Badge>
              <Badge color="brand">PostgreSQL</Badge>
              <Badge color="brand">Docker</Badge>
              <Badge color="brand">JWT</Badge>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  )
}
