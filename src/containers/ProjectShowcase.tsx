'use client'

import React, { useState, useEffect, useRef, useId, useCallback } from 'react'
import { cn } from '../components/ui/Utils/utils'
import { ProjectShowcaseContext } from './AppleProductCard'

/**
 * ProjectShowcaseGroup & ProjectShowcaseRow — Coordinated Cinema Spotlight
 * Manages active handover between project showcases:
 * - When going down: 'up' project blurs when hitting upper screen (rect <= 20), 'down' project activates.
 * - When going up: 'down' project blurs when moving towards bottom edge, 'up' project activates!
 * - When bottom edge of viewport hits the first project (moving up to Hero), all blur.
 */
export const ProjectShowcaseGroupContext = React.createContext<{
  registerRow: (id: string, el: HTMLElement) => void
  unregisterRow: (id: string) => void
  activeRowId: string | null
} | null>(null)

export interface ProjectShowcaseGroupProps {
  children: React.ReactNode
  className?: string
}

export function ProjectShowcaseGroup({
  children,
  className,
}: ProjectShowcaseGroupProps) {
  const rowsRef = useRef<Map<string, HTMLElement>>(new Map())
  const [activeRowId, setActiveRowId] = useState<string | null>(null)
  const lastScrollYRef = useRef(0)
  const scrollDirRef = useRef<'down' | 'up'>('down')

  const updateActiveRow = useCallback(() => {
    const vh = window.innerHeight
    const elementsWithIds = Array.from(rowsRef.current.entries()).filter(
      ([_, el]) => el.isConnected
    )

    if (elementsWithIds.length === 0) {
      setActiveRowId(null)
      return
    }

    // Sort rows top-to-bottom by vertical position in the document
    elementsWithIds.sort((a, b) => {
      const topA = a[1].getBoundingClientRect().top
      const topB = b[1].getBoundingClientRect().top
      return topA - topB
    })

    const firstRect = elementsWithIds[0][1].getBoundingClientRect()
    const lastRect = elementsWithIds[elementsWithIds.length - 1][1].getBoundingClientRect()

    // When moving up past the first project: bottom edge hits the first project -> blur all
    if (firstRect.top >= vh * 0.80) {
      setActiveRowId(null)
      return
    }

    // When scrolling down past the last project: upper screen hits the last project -> blur all
    if (lastRect.top <= 20) {
      setActiveRowId(null)
      return
    }

    const direction = scrollDirRef.current

    if (direction === 'up') {
      // When moving up: blur the 'down' project earlier when 30% covered by the bottom edge,
      // and activate the upper project immediately.
      let activeId: string | null = null
      for (let i = elementsWithIds.length - 1; i >= 0; i--) {
        const [id, el] = elementsWithIds[i]
        const rect = el.getBoundingClientRect()
        const isCovered30 = (rect.bottom - vh) >= 0.30 * rect.height
        if (!isCovered30) {
          activeId = id
          break
        }
      }
      setActiveRowId(activeId ?? elementsWithIds[0][0])
    } else {
      // When moving down: 'up' project blurs when hitting upper screen (rect.top <= 20),
      // and hands over focus to the next project below.
      const activeEntry = elementsWithIds.find(([_, el]) => {
        const rect = el.getBoundingClientRect()
        return rect.top > 20
      })
      setActiveRowId(activeEntry ? activeEntry[0] : null)
    }
  }, [])

  const registerRow = useCallback((id: string, el: HTMLElement) => {
    rowsRef.current.set(id, el)
    requestAnimationFrame(updateActiveRow)
  }, [updateActiveRow])

  const unregisterRow = useCallback((id: string) => {
    rowsRef.current.delete(id)
    requestAnimationFrame(updateActiveRow)
  }, [updateActiveRow])

  useEffect(() => {
    lastScrollYRef.current = window.scrollY
    updateActiveRow()

    let rafId: number | null = null
    const onScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollYRef.current) {
        scrollDirRef.current = 'down'
      } else if (currentScrollY < lastScrollYRef.current) {
        scrollDirRef.current = 'up'
      }
      lastScrollYRef.current = currentScrollY

      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        updateActiveRow()
        rafId = null
      })
    }

    const onResize = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        updateActiveRow()
        rafId = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [updateActiveRow])

  return (
    <ProjectShowcaseGroupContext.Provider
      value={{ registerRow, unregisterRow, activeRowId }}
    >
      <div className={className}>{children}</div>
    </ProjectShowcaseGroupContext.Provider>
  )
}

export interface ProjectShowcaseRowProps {
  children: React.ReactNode
  className?: string
}

export function ProjectShowcaseRow({
  children,
  className,
}: ProjectShowcaseRowProps) {
  const rowId = useId()
  const rowRef = useRef<HTMLDivElement | null>(null)
  const group = React.useContext(ProjectShowcaseGroupContext)
  const [standaloneActive, setStandaloneActive] = useState(false)

  // Register with parent showcase group if present
  useEffect(() => {
    const el = rowRef.current
    if (!el || !group) return

    group.registerRow(rowId, el)
    return () => group.unregisterRow(rowId)
  }, [group, rowId])

  // Standalone fallback if rendered outside a ProjectShowcaseGroup
  useEffect(() => {
    if (group) return
    const el = rowRef.current
    if (!el) return

    const updateActiveState = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const isPastUpperScreen = rect.top <= 20
      const isCovered30 = (rect.bottom - vh) >= 0.30 * rect.height
      const isBelowViewport = rect.top >= vh * 0.80
      setStandaloneActive(!isPastUpperScreen && !isCovered30 && !isBelowViewport)
    }

    updateActiveState()

    let rafId: number | null = null
    const onScrollOrResize = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        updateActiveState()
        rafId = null
      })
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [group])

  const isActive = group ? group.activeRowId === rowId : standaloneActive

  return (
    <ProjectShowcaseContext.Provider value={{ isActive }}>
      <div
        ref={rowRef}
        className={cn(
          'transition-all duration-normal ease-out will-change-[filter,opacity,transform]',
          isActive
            ? 'opacity-100 blur-none scale-100'
            : 'opacity-35 blur-[1.5px] scale-[0.985]',
          className
        )}
      >
        {children}
      </div>
    </ProjectShowcaseContext.Provider>
  )
}
