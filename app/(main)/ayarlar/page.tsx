"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  Moon,
  LogOut,
  ChevronRight,
  Ban,
} from "lucide-react"

const settingsItems = [
  {
    href: "/ayarlar/profil",
    icon: User,
    label: "Profil Düzenle",
    description: "Ad, bio ve profil fotoğrafını değiştir",
  },
  {
    href: "/ayarlar/engellenenler",
    icon: Ban,
    label: "Engellenen Kullanıcılar",
    description: "Engellediğin kullanıcıları yönet",
  },
  {
    href: "/ayarlar/guvenlik",
    icon: Shield,
    label: "Güvenlik",
    description: "Şifre ve hesap güvenliği",
  },
  {
    href: "/ayarlar/bildirimler",
    icon: Bell,
    label: "Bildirimler",
    description: "Bildirim tercihlerini ayarla",
  },
]

export default function SettingsPage() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = "/giris"
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Ayarlar</h1>
        </div>
      </header>

      {/* Settings List */}
      <div className="p-4 space-y-2">
        {settingsItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
                    <item.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Logout */}
        <Card
          className="border-border bg-card hover:bg-destructive/10 transition-colors cursor-pointer mt-4"
          onClick={handleLogout}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-destructive">Çıkış Yap</p>
                <p className="text-sm text-muted-foreground">Hesabından güvenli çıkış yap</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
