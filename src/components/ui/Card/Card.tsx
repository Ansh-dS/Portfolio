import React, { forwardRef } from 'react'
import { cardVariants, type CardVariantsType } from './styles'
import { cn } from '../Utils/utils'
import { Box } from '../Box/Box'

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type CleanProps = Prettify<CardVariantsType>

export type CardProps = CleanProps & React.HTMLAttributes<HTMLDivElement>

/**
 * Main Card Wrapper
 */
export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const {
    variant,
    elevation,
    padding = 'md',
    className,
    children,
    ...rest
  } = props

  return (
    <Box
      ref={ref}
      className={cn(
        cardVariants({ variant, elevation, padding }),
        'flex flex-col',
        className
      )}
      {...rest}
    >
      {children}
    </Box>
  )
})
Card.displayName = 'Card'
