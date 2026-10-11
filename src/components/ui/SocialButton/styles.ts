import { cva, type VariantProps } from 'class-variance-authority'

export const socialButtonVariants = cva(
  [
    'inline-flex items-center justify-center shrink-0',
    'rounded-medium font-weight-medium transition-all duration-fast',
    'border outline-none cursor-pointer',

    // focus-visible: when we are using tabs over the components
    // ring-2: these are shadows which looks like border where '2' is the thickness.
    'focus-visible:ring-2 focus-visible:ring-border-focused active:scale-[0.98]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
  ],
  {
    variants: {
      provider: {
        google:
          'bg-surface-base text-fg-primary border-border-default hover:bg-surface-sunken hover:border-border-strong',

        github:
          'bg-fg-primary text-fg-inverted border-transparent hover:opacity-90',

        apple:
          'bg-fg-primary text-fg-inverted border-transparent hover:opacity-90',

        linkedin:
          'bg-action-primary text-fg-inverted border-transparent hover:bg-action-primary-hover',

        twitter:
          'bg-fg-primary text-fg-inverted border-transparent hover:opacity-90',

        x: 'bg-fg-primary text-fg-inverted border-transparent hover:opacity-90',

        generic:
          'bg-surface-base text-fg-primary border-border-default hover:border-border-focused hover:bg-surface-raised',

        'magic-link': [
          'bg-action-primary-subtle text-fg-brand',
          'border border-action-primary/20 hover:bg-action-primary hover:text-fg-inverted',
        ],
      },
      size: {
        sm: 'w-full py-xs px-m gap-xs [&>span>svg]:w-4 [&>span>svg]:h-4',
        md: 'w-full py-s px-l gap-s [&>span>svg]:w-5 [&>span>svg]:h-5',
        lg: 'w-full py-m px-2xl gap-m [&>span>svg]:w-6 [&>span>svg]:h-6',
        icon: 'w-9 h-9 min-w-9 min-h-9 p-0 aspect-square [&>span>svg]:w-4.5 [&>span>svg]:h-4.5 rounded-medium',
      },
    },
    defaultVariants: {
      provider: 'generic',
      size: 'md',
    },
  }
)

export type SocialButtonVariantsType = VariantProps<typeof socialButtonVariants>
