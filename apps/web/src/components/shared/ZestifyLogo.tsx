"use client"

import { cn } from "@/lib/utils"

interface ZestifyLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
  textClassName?: string
}

const sizeMap = {
  xs: { icon: 24, text: "text-sm" },
  sm: { icon: 32, text: "text-base" },
  md: { icon: 36, text: "text-xl" },
  lg: { icon: 48, text: "text-2xl" },
  xl: { icon: 64, text: "text-3xl" },
}

export function ZestifyLogo({ size = "md", showText = true, className, textClassName }: ZestifyLogoProps) {
  const s = sizeMap[size]

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Logo Icon — Stylized "Z" with upward growth arrow (Concept #1) */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Background rounded square */}
        <rect
          width="48"
          height="48"
          rx="12"
          fill="url(#logo-bg-gradient)"
        />

        {/* Z letterform */}
        <path
          d="M14 14H34L18 34H34"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Upward growth arrow */}
        <path
          d="M32 18V10H24"
          stroke="url(#arrow-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="logo-bg-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22C55E" />
            <stop offset="0.5" stopColor="#16A34A" />
            <stop offset="1" stopColor="#15803D" />
          </linearGradient>
          <linearGradient id="arrow-gradient" x1="24" y1="18" x2="32" y2="10" gradientUnits="userSpaceOnUse">
            <stop stopColor="#BBF7D0" />
            <stop offset="1" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>
      </svg>

      {/* Text */}
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight",
            s.text,
            textClassName
          )}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400">
            Zestify
          </span>
        </span>
      )}
    </div>
  )
}

export function ZestifyLogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <rect width="48" height="48" rx="12" fill="url(#logo-bg-gradient-mark)" />
      <path
        d="M14 14H34L18 34H34"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 18V10H24"
        stroke="url(#arrow-gradient-mark)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="logo-bg-gradient-mark" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22C55E" />
          <stop offset="0.5" stopColor="#16A34A" />
          <stop offset="1" stopColor="#15803D" />
        </linearGradient>
        <linearGradient id="arrow-gradient-mark" x1="24" y1="18" x2="32" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BBF7D0" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
    </svg>
  )
}
