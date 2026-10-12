import type { LeetCodeApiResponse } from '@/app/api/leetcode/route'

export type ContributionCategory = 'merged' | 'open-prs' | 'open-issues'

export interface OpenSourceContribution {
  id: string
  number: string
  title: string
  type: 'pr' | 'issue'
  category: ContributionCategory
  summary: string
  link: string
  impactBadge?: string
}

export const OPEN_SOURCE_CONTRIBUTIONS: OpenSourceContribution[] = [
  // --- MERGED (1) ---
  {
    id: 'rc-35318',
    number: '#35318',
    title: 'Incomplete Room Name Validation Message',
    type: 'pr',
    category: 'merged',
    summary:
      'Fixed an incomplete validation message shown when creating or editing room names. Resolved ambiguous feedback by updating i18n localization strings to provide clear, actionable constraints.',
    link: 'https://github.com/RocketChat/Rocket.Chat/pull/35318',
    impactBadge: 'i18n & Validation',
  },

  // --- OPEN ISSUES & BUG REPORTS (8) ---
  {
    id: 'rc-35289',
    number: '#35289',
    title: 'Channel Name Not Displayed in Leave Confirmation Dialog',
    type: 'issue',
    category: 'open-issues',
    summary:
      'Reported context binding failure where leave-channel confirmation dialogs displayed undefined channel handles. Provided reproduction telemetry and trace to ensure atomic state injection before modal mount.',
    link: 'https://github.com/RocketChat/Rocket.Chat/issues/35289',
    impactBadge: 'Context State',
  },
  {
    id: 'rc-35292',
    number: '#35292',
    title: 'Markdown Bold Formatting Parser Edge Case',
    type: 'issue',
    category: 'open-issues',
    summary:
      'Reported a Markdown formatting bug where text wrapped as "*yourMessage:*" fails to render as bold when the colon immediately precedes the closing asterisk. Documented reproduction steps and video telemetry leading to parser resolution.',
    link: 'https://github.com/RocketChat/Rocket.Chat/issues/35292',
    impactBadge: 'Markdown Parser',
  },
  {
    id: 'rc-35160',
    number: '#35160',
    title: 'Save Button State Desynchronization',
    type: 'issue',
    category: 'open-issues',
    summary:
      'Discovered and reproduced an unhandled form dirty-state bug where the Save button remained enabled without pending changes. Maintainers validated the diagnosis and aligned core state UX.',
    link: 'https://github.com/RocketChat/Rocket.Chat/issues/35160',
    impactBadge: 'Maintainer Validated',
  },
  {
    id: 'rc-35518',
    number: '#35518',
    title: 'Loader Stuck After Closing iframe',
    type: 'issue',
    category: 'open-issues',
    summary:
      'Reported a persistent loading freeze where loading skeletons remained active after clicking outside embedded iframes. Traced missing unmount event listeners and documented reproduction steps.',
    link: 'https://github.com/RocketChat/Rocket.Chat/issues/35518',
    impactBadge: 'Lifecycle Cleanup',
  },
  {
    id: 'rc-35499',
    number: '#35499',
    title: 'Duplicate File Upload Warnings',
    type: 'issue',
    category: 'open-issues',
    summary:
      'Reported redundant validation warnings firing simultaneously for 0 KB files and SVG uploads. Outlined multi-part stream flow and recommended single-pass validation check.',
    link: 'https://github.com/RocketChat/Rocket.Chat/issues/35499',
    impactBadge: 'Upload Pipeline',
  },
  {
    id: 'rc-35412',
    number: '#35412',
    title: 'Channel Remains Open After Hide',
    type: 'issue',
    category: 'open-issues',
    summary:
      'Identified and documented a state synchronization bug where clicking "Hide" removed a channel from the sidebar but left it open in the main view. Provided root-cause analysis and reproduction telemetry.',
    link: 'https://github.com/RocketChat/Rocket.Chat/issues/35412',
    impactBadge: 'State Synchronization',
  },
  {
    id: 'rc-35435',
    number: '#35435',
    title: 'Discussion Count Calculation Mismatch',
    type: 'issue',
    category: 'open-issues',
    summary:
      'Identified and documented inconsistent thread aggregation where displayed discussion count diverged from underlying datastore. Provided step-by-step reproduction and telemetry for maintainers.',
    link: 'https://github.com/RocketChat/Rocket.Chat/issues/35435',
    impactBadge: 'Root-Cause QA',
  },
  {
    id: 'rc-35368',
    number: '#35368',
    title: 'Special Character Room Name Sanitization Regression',
    type: 'issue',
    category: 'open-issues',
    summary:
      'Uncovered an edge-case regression in room sanitization regex where toggling allow-rules wiped existing valid room identifiers. Collaborated with maintainers to delineate safe character boundaries.',
    link: 'https://github.com/RocketChat/Rocket.Chat/issues/35368',
    impactBadge: 'Maintainer Engaged',
  },

  // --- OPEN PRS (6) ---
  {
    id: 'excalidraw-12107',
    number: '#12107',
    title: 'Radial Hitbox Detection & Geometry Engine',
    type: 'pr',
    category: 'open-prs',
    summary:
      'Tackling core vector engine mathematics: re-architecting radial hitbox detection logic for circular and curved canvas primitives to eliminate false clicks and boundary selection dead zones.',
    link: 'https://github.com/excalidraw/excalidraw/pull/12107',
    impactBadge: 'Canvas Math & Geometry',
  },
  {
    id: 'excalidraw-12122',
    number: '#12122',
    title: 'Infinite Canvas UI Scaling & Viewport Transform',
    type: 'pr',
    category: 'open-prs',
    summary:
      'Engineering dynamic viewport coordinate transforms and responsive canvas scaling across multi-DPI resolutions. Preserves crisp vector element rendering and prevents layout drift during aggressive scaling.',
    link: 'https://github.com/excalidraw/excalidraw/pull/12122',
    impactBadge: 'Viewport Engine',
  },
  {
    id: 'excalidraw-12069',
    number: '#12069',
    title: 'Vitest Coverage Excludes & UI Startup Fix',
    type: 'pr',
    category: 'open-prs',
    summary:
      "Configured test coverage to inherit Vitest's default exclude patterns while resolving a startup failure in the Vitest UI. Improves local testing and coverage reporting consistency.",
    link: 'https://github.com/excalidraw/excalidraw/pull/12069',
    impactBadge: 'Vitest Engine',
  },
  {
    id: 'excalidraw-12049',
    number: '#12049',
    title: 'PWA Precache Limit (4MB) & Docker CI Pipeline',
    type: 'pr',
    category: 'open-prs',
    summary:
      "Bumped Workbox precache limit from 2.3MB to 4MB to resolve failing production Docker builds. Integrated yarn build:app:docker check into CI to catch bundle-size regressions before merge.",
    link: 'https://github.com/excalidraw/excalidraw/pull/12049',
    impactBadge: 'CI/CD & PWA',
  },
  {
    id: 'excalidraw-12112',
    number: '#12112',
    title: 'Sidebar Test Context Mismatch & Mermaid Mock Types',
    type: 'pr',
    category: 'open-prs',
    summary:
      'Resolved DefaultSidebar test context mismatch by importing direct TypeScript source instead of compiled bundle. Fixed Mermaid mock typing by casting to LocalPoint[], securing full test and typecheck passes.',
    link: 'https://github.com/excalidraw/excalidraw/pull/12112',
    impactBadge: 'TypeScript & Testing',
  },
  {
    id: 'rc-35542',
    number: '#35542',
    title: 'Chatbot User Information Panel Layout Architecture',
    type: 'pr',
    category: 'open-prs',
    summary:
      'Restructuring chatbot action grids and metadata panels to eliminate button overlap and responsive overflow on condensed viewports. Standardized layout tokens across message headers.',
    link: 'https://github.com/RocketChat/Rocket.Chat/pull/35542',
    impactBadge: 'Layout Polish',
  },
]

export const CATEGORY_COUNTS = {
  merged: OPEN_SOURCE_CONTRIBUTIONS.filter((c) => c.category === 'merged').length,
  'open-prs': OPEN_SOURCE_CONTRIBUTIONS.filter((c) => c.category === 'open-prs').length,
  'open-issues': OPEN_SOURCE_CONTRIBUTIONS.filter((c) => c.category === 'open-issues').length,
} as const

export const DEFAULT_LEETCODE: LeetCodeApiResponse = {
  success: true,
  username: '0hUybs2mus',
  rating: 1460,
  profileRanking: 3711622,
  totalSolved: 25,
  easySolved: 10,
  mediumSolved: 12,
  hardSolved: 3,
  attendedContests: 5,
  primaryLanguage: 'C++',
  profileUrl: 'https://leetcode.com/u/0hUybs2mus/',
  isLive: false,
}
