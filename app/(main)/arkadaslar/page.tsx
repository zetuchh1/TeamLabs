"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Users } from "lucide-react"
import type { User } from "@/lib/types"

export default function FriendsPage() {
  const { user } = useAuth()
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return
    try {
      const [followersRes, followingRes] = await Promise.all([
        fetch(`/api/users/${user.username}/followers`),
        fetch(`/api/users/${user.username}/following`),
      ])
      const [followersData, followingData] = await Promise.all([
        followersRes.json(),
        followingRes.json(),
      ])

      if (followersData.success) {
        setFollowers(followersData.data)
      }
      if (followingData.success) {
        setFollowing(followingData.data)
      }
    } catch (error) {
      console.error("Failed to fetch friends:", error)
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

  const renderUserList = (users: User[], emptyMessage: string) => {
    if (users.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )
    }

    return (
      <div className="divide-y divide-border">
        {users.map((u) => (
          <Link
            key={u.id}
            href={`/profil/${u.username}`}
            className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors"
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={u.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {u.display_name?.[0]?.toUpperCase() || u.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {u.display_name || u.username}
              </p>
              <p className="text-sm text-muted-foreground truncate">@{u.username}</p>
              {u.bio && (
                <p className="text-sm text-muted-foreground truncate mt-1">{u.bio}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Arkadaşlar</h1>
        </div>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="followers" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0">
          <TabsTrigger
            value="followers"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            Takipçiler ({followers.length})
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            Takip Edilenler ({following.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="followers" className="mt-0">
          {renderUserList(followers, "Henüz takipçin yok")}
        </TabsContent>
        <TabsContent value="following" className="mt-0">
          {renderUserList(following, "Henüz kimseyi takip etmiyorsun")}
        </TabsContent>
      </Tabs>
    </div>
  )
}
