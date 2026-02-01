"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Camera, Check } from "lucide-react"

export default function EditProfilePage() {
  const router = useRouter()
  const { user, updateUser } = useAuth()
  const [displayName, setDisplayName] = useState(user?.display_name || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName,
          bio,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        updateUser(data.user)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.error || "Profil güncellenemedi")
      }
    } catch {
      setError("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Profili Düzenle</h1>
          </div>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : success ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Kaydedildi
              </>
            ) : (
              "Kaydet"
            )}
          </Button>
        </div>
      </header>

      <div className="p-4">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {displayName?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">Profil fotoğrafını değiştir</p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm">
                  Profil başarıyla güncellendi!
                </div>
              )}

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-foreground">
                  Görünen Ad
                </Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  maxLength={100}
                  className="bg-input border-border"
                />
              </div>

              {/* Username (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">
                  Kullanıcı Adı
                </Label>
                <Input
                  id="username"
                  value={`@${user.username}`}
                  disabled
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Kullanıcı adı değiştirilemez
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-foreground">
                  Hakkında
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Kendinden bahset..."
                  maxLength={160}
                  rows={3}
                  className="bg-input border-border resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">{bio.length}/160</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
