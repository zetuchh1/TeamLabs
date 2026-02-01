"use client"

import React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Send, Gamepad2 } from "lucide-react"

interface CreatePostProps {
  onPostCreated?: () => void
  remainingPosts?: number
}

export function CreatePost({ onPostCreated, remainingPosts = 3 }: CreatePostProps) {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [isLookingForFriend, setIsLookingForFriend] = useState(false)
  const [gameName, setGameName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || remainingPosts <= 0) return

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          post_type: isLookingForFriend ? "looking_for_friend" : "general",
          game_name: isLookingForFriend ? gameName : undefined,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setContent("")
        setGameName("")
        setIsLookingForFriend(false)
        onPostCreated?.()
      } else {
        setError(data.error || "Gönderi oluşturulamadı")
      }
    } catch {
      setError("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <Avatar className="w-12 h-12 shrink-0">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.display_name?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Ne düşünüyorsun? Arkadaş mı arıyorsun?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[80px] resize-none bg-input border-border focus:border-primary"
                maxLength={500}
              />

              {/* Looking for friend toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="looking-for-friend" className="text-sm text-foreground cursor-pointer">
                    Arkadaş arıyorum
                  </Label>
                </div>
                <Switch
                  id="looking-for-friend"
                  checked={isLookingForFriend}
                  onCheckedChange={setIsLookingForFriend}
                />
              </div>

              {/* Game name input */}
              {isLookingForFriend && (
                <Input
                  placeholder="Oyun adı (örn: Valorant, CS2, LoL)"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="bg-input border-border focus:border-primary"
                />
              )}

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className={content.length > 450 ? "text-warning" : ""}>
                    {content.length}/500
                  </span>
                  {" · "}
                  <span className={remainingPosts <= 1 ? "text-warning" : ""}>
                    Bugün {remainingPosts} gönderi hakkınız kaldı
                  </span>
                </div>
                <Button
                  type="submit"
                  disabled={!content.trim() || isLoading || remainingPosts <= 0}
                  className="gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Paylaş
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
