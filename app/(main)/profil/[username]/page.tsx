"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/post-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Loader2,
  ArrowLeft,
  Settings,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  Ban,
  MessageSquare,
  Calendar,
  Users,
  UserCheck,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import type { UserProfile, Post } from "@/lib/types"

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const isOwnProfile = currentUser?.username === username

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/users/${username}`)
      const data = await res.json()
      if (data.success) {
        setProfile(data.data)
        setPosts(data.data.posts || [])
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollow = async () => {
    if (!profile) return
    setActionLoading("follow")
    try {
      if (profile.is_following) {
        await fetch(`/api/users/${username}/follow`, { method: "DELETE" })
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                is_following: false,
                followers_count: prev.followers_count - 1,
              }
            : null
        )
      } else {
        await fetch(`/api/users/${username}/follow`, { method: "POST" })
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                is_following: true,
                followers_count: prev.followers_count + 1,
              }
            : null
        )
      }
    } catch (error) {
      console.error("Failed to follow/unfollow:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBlock = async () => {
    if (!profile) return
    setActionLoading("block")
    try {
      if (profile.is_blocked) {
        await fetch(`/api/users/${username}/block`, { method: "DELETE" })
        setProfile((prev) => (prev ? { ...prev, is_blocked: false } : null))
      } else {
        await fetch(`/api/users/${username}/block`, { method: "POST" })
        setProfile((prev) => (prev ? { ...prev, is_blocked: true, is_following: false } : null))
      }
    } catch (error) {
      console.error("Failed to block/unblock:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleMessage = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })
      const data = await res.json()
      if (data.success) {
        router.push(`/mesajlar/${data.data.id}`)
      }
    } catch (error) {
      console.error("Failed to start conversation:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-4 px-4 py-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Profil</h1>
          </div>
        </header>
        <div className="text-center py-12">
          <p className="text-foreground font-medium">Kullanıcı bulunamadı</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-sm text-muted-foreground">{profile.posts_count} gönderi</p>
            </div>
          </div>
          {isOwnProfile && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/ayarlar">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>
          )}
        </div>
      </header>

      {/* Profile Header */}
      <div className="p-4 border-b border-border">
        {/* Cover Image Placeholder */}
        <div className="h-32 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 mb-4" />

        {/* Avatar and Actions */}
        <div className="flex items-end justify-between -mt-16 mb-4">
          <Avatar className="w-24 h-24 border-4 border-background">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {profile.display_name?.[0]?.toUpperCase() || profile.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {!isOwnProfile && (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleBlock}>
                    <Ban className="w-4 h-4 mr-2" />
                    {profile.is_blocked ? "Engeli Kaldır" : "Engelle"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="icon" onClick={handleMessage}>
                <MessageSquare className="w-5 h-5" />
              </Button>

              <Button
                onClick={handleFollow}
                disabled={actionLoading === "follow" || profile.is_blocked}
                variant={profile.is_following ? "outline" : "default"}
              >
                {actionLoading === "follow" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : profile.is_following ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Takibi Bırak
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Takip Et
                  </>
                )}
              </Button>
            </div>
          )}

          {isOwnProfile && (
            <Button variant="outline" asChild>
              <Link href="/ayarlar/profil">Profili Düzenle</Link>
            </Button>
          )}
        </div>

        {/* User Info */}
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {profile.display_name || profile.username}
            </h2>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>

          {profile.bio && <p className="text-foreground">{profile.bio}</p>}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true, locale: tr })}{" "}
              katıldı
            </span>
          </div>

          {/* Follow Stats */}
          <div className="flex items-center gap-4">
            <Link
              href={`/profil/${username}/takip-edilenler`}
              className="hover:underline"
            >
              <span className="font-semibold text-foreground">{profile.following_count}</span>
              <span className="text-muted-foreground ml-1">Takip Edilen</span>
            </Link>
            <Link
              href={`/profil/${username}/takipciler`}
              className="hover:underline"
            >
              <span className="font-semibold text-foreground">{profile.followers_count}</span>
              <span className="text-muted-foreground ml-1">Takipçi</span>
            </Link>
          </div>

          {/* Follow Status */}
          {!isOwnProfile && profile.is_followed_by && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <UserCheck className="w-4 h-4" />
              Seni takip ediyor
            </div>
          )}
        </div>
      </div>

      {/* Posts Tab */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0">
          <TabsTrigger
            value="posts"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            Gönderiler
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-0">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Henüz gönderi yok</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <div key={post.id} className="p-4">
                  <PostCard post={{ ...post, user: profile }} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
