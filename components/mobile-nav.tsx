"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Home, MessageSquare, Bell, User, Search } from "lucide-react"

const navItems = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/kesfet", label: "Keşfet", icon: Search },
  { href: "/mesajlar", label: "Mesajlar", icon: MessageSquare },
  { href: "/bildirimler", label: "Bildirimler", icon: Bell },
]

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50",
        className
      )}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
        {user && (
          <Link
            href={`/profil/${user.username}`}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              pathname.startsWith("/profil") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profil</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
