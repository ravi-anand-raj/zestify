"use client"

import { Bell } from "lucide-react"

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-black/50 backdrop-blur-md px-6 justify-between">
      <div className="flex-1">
        {/* Breadcrumbs or Page Title could go here */}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-sm font-bold text-black cursor-pointer shadow-[0_0_10px_rgba(48,209,88,0.3)] hover:scale-105 transition-transform">
          JS
        </div>
      </div>
    </header>
  )
}
