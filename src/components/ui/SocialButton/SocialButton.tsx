'use client'
import React, { forwardRef, ElementType } from 'react'
import { socialButtonVariants, SocialButtonVariantsType } from './styles'
import { cn } from '../Utils/utils'
import { Text } from '../Text/Text'

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

// ============================================================================
// RAW SVG ASSETS (Hardcoded to prevent dependency issues)
// ============================================================================

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="w-full h-full"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
)

const GithubIcon = ({ fill = 'currentColor' }: { fill?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    className="w-full h-full"
  >
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

// fill: it is the predefined colors for github icon.
const AppleIcon = ({ fill = 'currentColor' }: { fill?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    className="w-full h-full"
  >
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.126 3.805 3.067 1.52-.058 2.114-.98 3.96-.98 1.832 0 2.394.98 3.987.95 1.638-.027 2.65-1.503 3.65-2.95 1.155-1.685 1.632-3.321 1.65-3.411-.035-.015-3.193-1.222-3.219-4.88-.022-3.056 2.502-4.53 2.614-4.59-1.428-2.091-3.642-2.381-4.437-2.415-1.748-.168-3.447 1.145-4.328 1.145zm.775-5.908c-.808.974-1.353 2.327-1.206 3.651 1.17.045 2.571-.686 3.41-1.657.77-.887 1.41-2.257 1.233-3.56-1.298.052-2.656.63-3.437 1.566z" />
  </svg>
)

const LinkedinIcon = ({ fill = 'currentColor' }: { fill?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    className="w-full h-full"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
  </svg>
)

const TwitterIcon = ({ fill = 'currentColor' }: { fill?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    className="w-full h-full"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// ============================================================================
// COMPONENT
// ============================================================================

type SocialButtonCustomProps = {
  label?: string
  href?: string
}

type CleanProps = Prettify<SocialButtonCustomProps & SocialButtonVariantsType>

export type SocialButtonProps = CleanProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>

export const SocialButton = forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  SocialButtonProps
>((props, ref) => {
  const {
    className,
    provider = 'generic',
    size = 'md',
    label,
    href,
    target = href ? '_blank' : undefined,
    rel = href ? 'noopener noreferrer' : undefined,
    ...rest
  } = props

  // changes the size of text accordingly.
  const textVariant =
    size === 'lg' ? 'body' : size === 'sm' ? 'caption' : 'label'

  // 2. Map the Provider string to the correct Hardcoded SVG
  const renderIcon = () => {
    switch (provider) {
      case 'google':
        return <GoogleIcon />
      case 'github':
        return <GithubIcon fill="currentColor" />
      case 'apple':
        return <AppleIcon fill="currentColor" />
      case 'linkedin':
        return <LinkedinIcon fill="currentColor" />
      case 'twitter':
      case 'x':
        return <TwitterIcon fill="currentColor" />
      default:
        return null
    }
  }

  const icon = renderIcon()
  const showLabel = Boolean(label) && size !== 'icon'
  const Component: ElementType = href ? 'a' : 'button'

  return (
    <Component
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      type={href ? undefined : 'button'}
      aria-label={
        label || (typeof provider === 'string' ? provider : 'social link')
      }
      title={label || (typeof provider === 'string' ? provider : undefined)}
      className={cn(socialButtonVariants({ provider, size }), className)}
      {...rest}
    >
      {icon && (
        <span className="shrink-0 flex items-center justify-center icon-container">
          {icon}
        </span>
      )}

      {showLabel && (
        <Text variant={textVariant} weight="medium">
          {label}
        </Text>
      )}
    </Component>
  )
})

SocialButton.displayName = 'SocialButton'
