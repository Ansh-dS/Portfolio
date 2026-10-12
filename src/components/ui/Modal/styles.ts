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
    'mx-auto',
    'p-6',
    'transition-transform',
    'focus:outline-none',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-[24rem]',
        md: 'max-w-[28rem]',
        lg: 'max-w-[32rem]',
        xl: 'max-w-[36rem]',
        '2xl': 'max-w-[42rem]',
        '3xl': 'max-w-[56rem]',
        '4xl': 'max-w-[64rem]',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export type ModalVariantsType = VariantProps<typeof modalContentVariants>
