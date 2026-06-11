"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Wallet, 
  LineChart, 
  Bot, 
  Route, 
  Target, 
  Calculator,
  Settings,
  CreditCard
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Portfolio", href: "/portfolio", icon: Wallet },
  { name: "Watchlist", href: "/watchlist", icon: LineChart },
  { name: "ZUST AI", href: "/zust-ai", icon: Bot, highlight: true },
  { name: "Roadmap", href: "/roadmap", icon: Route },
  { name: "Goal Planner", href: "/goals", icon: Target },
  { name: "Simulator", href: "/simulator", icon: Calculator },
]

const bottomItems = [
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-screen w-64 border-r border-white/5 bg-black/80 backdrop-blur-xl p-4 sticky top-0">
      <div className="flex items-center px-2 py-6 mb-4">
        <span className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">
          ZESTIFY
        </span>
      </div>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <span className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                isActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
                item.highlight && !isActive && "text-primary shadow-[0_0_10px_rgba(10,132,255,0.1)] hover:shadow-[0_0_15px_rgba(10,132,255,0.2)]"
              )}>
                <item.icon className={cn("mr-3 flex-shrink-0 h-5 w-5", isActive ? "text-white" : "text-gray-400 group-hover:text-white", item.highlight && "text-primary")} />
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>

      <div className="mt-auto pt-4 space-y-1 border-t border-white/5">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <span className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all",
                isActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}>
                <item.icon className={cn("mr-3 flex-shrink-0 h-5 w-5", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
