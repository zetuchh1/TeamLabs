"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ArrowLeft, Ban, UserX } from "lucide-react"
import type { User } from "@/lib/types"

export default function BlockedUsersPage() {
  const router = useRouter()
  const [blockedUsers, setBlockedUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [unblockingId, setUnblockingId] = useState<number | null>(null)

  useEffect(() => {
    fetchBlockedUsers()
  }, [])

  const fetchBlockedUsers = async () => {
    try {
      const res = await fetch("/api/users/me/blocked")
      const data = await res.json()
      if (data.success) {
        setBlockedUsers(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch blocked users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnblock = async (username: string, userId: number) => {
    setUnblockingId(userId)
    try {
      const res = await fetch(`/api/users/${username}/block`, {
        method: "DELETE",
      })
      if (res.ok) {
        setBlockedUsers((prev) => prev.filter((u) => u.id !== userId))
      }
    } catch (error) {
      console.error("Failed to unblock user:", error)
    } finally {
      setUnblockingId(null)
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
          <h1 className="text-xl font-bold text-foreground">Engellenen Kullanıcılar</h1>
        </div>
      </header>

      {/* Blocked Users List */}
      <div className="p-4">
        {blockedUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                <Ban className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <p className="text-foreground font-medium">Engellenmiş kullanıcı yok</p>
            <p className="text-sm text-muted-foreground mt-1">
              Birini engellediğinizde burada görünecek
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {blockedUsers.map((user) => (
              <Card key={user.id} className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/profil/${user.username}`}>
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.display_name?.[0]?.toUpperCase() ||
                            user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/profil/${user.username}`}>
                        <p className="font-medium text-foreground truncate hover:underline">
                          {user.display_name || user.username}
                        </p>
                      </Link>
                      <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnblock(user.username, user.id)}
                      disabled={unblockingId === user.id}
                    >
                      {unblockingId === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <UserX className="w-4 h-4 mr-2" />
                          Engeli Kaldır
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
