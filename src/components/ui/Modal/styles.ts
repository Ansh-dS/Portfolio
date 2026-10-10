import { cva, type VariantProps } from 'class-variance-authority'

export const modalWrapperVariants = cva([
  'fixed',
  'inset-0',
  'flex',
  'items-center',
  'justify-center',
  'z-[100]',
  'p-4',
])

export const modalContentVariants = cva(
  [
    'relative',
    'bg-surface-base',
    'rounded-medium',
    'shadow-modal',
    'w-full',
    'p-6',
    'transition-transform',
    'focus:outline-none',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export type ModalVariantsType = VariantProps<typeof modalContentVariants>
