"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Users } from "lucide-react"
import type { User } from "@/lib/types"

export default function FollowingPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const router = useRouter()
  const [following, setFollowing] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFollowing()
  }, [username])

  const fetchFollowing = async () => {
    try {
      const res = await fetch(`/api/users/${username}/following`)
      const data = await res.json()
      if (data.success) {
        setFollowing(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch following:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Takip Edilenler</h1>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>
        </div>
      </header>

      {/* Following List */}
      <div className="divide-y divide-border">
        {following.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <p className="text-foreground font-medium">Henüz kimseyi takip etmiyor</p>
          </div>
        ) : (
          following.map((user) => (
            <Link
              key={user.id}
              href={`/profil/${user.username}`}
              className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.display_name?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {user.display_name || user.username}
                </p>
                <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                {user.bio && (
                  <p className="text-sm text-muted-foreground truncate mt-1">{user.bio}</p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
