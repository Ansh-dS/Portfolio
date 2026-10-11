// ============================================================================
// Containers / Advanced Components — Barrel Export
// Import path: '@/src/containers'
// ============================================================================

// Media
export { VideoPlayer, MediaWrapper } from './VideoPlayer'
export type { VideoPlayerProps, MediaWrapperProps } from './VideoPlayer'
export { AppleProductCard, ProjectShowcaseContext } from './AppleProductCard'
export type {
  AppleProductCardProps,
  ProjectShowcaseContextType,
} from './AppleProductCard'
export {
  ProjectShowcaseGroup,
  ProjectShowcaseRow,
  ProjectShowcaseGroupContext,
} from './ProjectShowcase'
export type {
  ProjectShowcaseGroupProps,
  ProjectShowcaseRowProps,
} from './ProjectShowcase'

// Layout
export { BentoGrid, BentoCard } from './BentoGrid'
export type { BentoGridProps, BentoCardProps } from './BentoGrid'

// Navigation
export { FloatingDock } from './FloatingDock'
export type { FloatingDockProps, FloatingDockItem } from './FloatingDock'

// Tabs
export { SegmentedControl, AnimatedTabIndicator } from './SegmentedControl'
export type {
  SegmentedControlProps,
  SegmentedControlItem,
  AnimatedTabIndicatorProps,
  TabItem,
} from './SegmentedControl'

// Data Visualization
export { ActivityHeatmap, ContributionGrid } from './ActivityHeatmap'
export type {
  ActivityHeatmapProps,
  ContributionGridProps,
  HeatmapData,
} from './ActivityHeatmap'

export { RadialProgress, ArcGauge } from './RadialProgress'
export type { RadialProgressProps, ArcGaugeProps } from './RadialProgress'

// Code & Developer
export { Kbd, CodeBlock, TerminalWindow } from './CodeBlock'
export type {
  KbdProps,
  CodeBlockProps,
  TerminalWindowProps,
  TerminalLine,
} from './CodeBlock'

// Cards & Previews
export { LinkPreviewCard, ArticleCard } from './LinkPreviewCard'
export type { LinkPreviewCardProps, ArticleCardProps } from './LinkPreviewCard'

// Theme
export { ThemeToggle } from './ThemeToggle'
export type { ThemeToggleProps } from './ThemeToggle'
