'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ============================================================================
// useScrollSpy — IntersectionObserver wrapper for FloatingNav active state
// ============================================================================

export interface UseScrollSpyOptions {
  /** CSS selectors or element IDs to observe (e.g., ['#hero', '#about', '#projects']) */
  sectionIds: string[]
  /** IntersectionObserver rootMargin. Negative top value triggers earlier. */
  rootMargin?: string
  /** Visibility ratio threshold (0–1). Default: 0.3 = 30% visible triggers active. */
  threshold?: number
}

export interface UseScrollSpyReturn {
  /** The currently active section ID (without #) */
  activeId: string
  /** Map of sectionId → IntersectionObserverEntry for advanced consumers */
  entries: Map<string, IntersectionObserverEntry>
}

export function useScrollSpy({
  sectionIds,
  rootMargin = '-20% 0px -60% 0px',
  threshold = 0.3,
}: UseScrollSpyOptions): UseScrollSpyReturn {
  const [activeId, setActiveId] = useState<string>('')
  const entriesRef = useRef<Map<string, IntersectionObserverEntry>>(new Map())
  const [entries, setEntries] = useState<Map<string, IntersectionObserverEntry>>(
    new Map()
  )

  const handleIntersect = useCallback(
    (observerEntries: IntersectionObserverEntry[]) => {
      observerEntries.forEach((entry) => {
        entriesRef.current.set(entry.target.id, entry)
      })

      // Find the topmost visible section
      const visibleSections = sectionIds.filter((id) => {
        const cleanId = id.replace('#', '')
        const entry = entriesRef.current.get(cleanId)
        return entry?.isIntersecting
      })

      if (visibleSections.length > 0) {
        setActiveId(visibleSections[0].replace('#', ''))
      }

      setEntries(new Map(entriesRef.current))
    },
    [sectionIds]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold,
    })

    sectionIds.forEach((id) => {
      const cleanId = id.replace('#', '')
      const element = document.getElementById(cleanId)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sectionIds, rootMargin, threshold, handleIntersect])

  return { activeId, entries }
}
