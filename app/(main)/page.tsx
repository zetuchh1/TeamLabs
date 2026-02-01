"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { CreatePost } from "@/components/create-post"
import { PostCard } from "@/components/post-card"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Post, User } from "@/lib/types"

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [posts, setPosts] = useState<(Post & { user?: User })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [remainingPosts, setRemainingPosts] = useState(3)

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/posts")
      const data = await res.json()
      if (data.success) {
        setPosts(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchRemainingPosts = useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch("/api/posts/remaining")
      const data = await res.json()
      if (data.success) {
        setRemainingPosts(data.remaining)
      }
    } catch {
      // Fallback to 3
    }
  }, [user])

  useEffect(() => {
    fetchPosts()
    fetchRemainingPosts()
  }, [fetchPosts, fetchRemainingPosts])

  const handlePostCreated = () => {
    fetchPosts()
    setRemainingPosts((prev) => Math.max(0, prev - 1))
  }

  const handleMessageClick = async (username: string) => {
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

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Ana Sayfa</h1>
          <Button variant="ghost" size="icon" onClick={fetchPosts} disabled={isLoading}>
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      {/* Create Post */}
      <div className="p-4 border-b border-border">
        <CreatePost onPostCreated={handlePostCreated} remainingPosts={remainingPosts} />
      </div>

      {/* Posts Feed */}
      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Henüz gönderi yok</p>
            <p className="text-sm text-muted-foreground mt-1">
              İlk gönderiyi sen paylaş!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-4">
              <PostCard
                post={post}
                onMessageClick={post.user_id !== user?.id ? handleMessageClick : undefined}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
