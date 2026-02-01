"use client"

import { Bell } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Bildirimler</h1>
        </div>
      </header>

      {/* Empty State */}
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
        <p className="text-foreground font-medium">Bildirim yok</p>
        <p className="text-sm text-muted-foreground mt-1">
          Yeni bildirimler geldiğinde burada görünecek
        </p>
      </div>
    </div>
  )
}
