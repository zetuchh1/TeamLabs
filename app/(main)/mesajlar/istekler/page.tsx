"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ArrowLeft, Check, X, Inbox } from "lucide-react"
import type { MessageRequest, User } from "@/lib/types"

export default function MessageRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<(MessageRequest & { sender: User })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/message-requests")
      const data = await res.json()
      if (data.success) {
        setRequests(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async (conversationId: number) => {
    setActionLoading(conversationId)
    try {
      const res = await fetch(`/api/message-requests/${conversationId}`, {
        method: "POST",
      })
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.conversation_id !== conversationId))
        router.push(`/mesajlar/${conversationId}`)
      }
    } catch (error) {
      console.error("Failed to accept request:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDecline = async (conversationId: number) => {
    setActionLoading(conversationId)
    try {
      const res = await fetch(`/api/message-requests/${conversationId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.conversation_id !== conversationId))
      }
    } catch (error) {
      console.error("Failed to decline request:", error)
    } finally {
      setActionLoading(null)
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
          <h1 className="text-xl font-bold text-foreground">Mesaj İstekleri</h1>
        </div>
      </header>

      {/* Info */}
      <div className="p-4 border-b border-border bg-secondary/30">
        <p className="text-sm text-muted-foreground">
          Takip etmediğiniz kişilerden gelen mesaj istekleri burada görünür. Kabul ettiğinizde
          mesajlaşmaya başlayabilirsiniz.
        </p>
      </div>

      {/* Requests List */}
      <div className="divide-y divide-border">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                <Inbox className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <p className="text-foreground font-medium">Mesaj isteği yok</p>
            <p className="text-sm text-muted-foreground mt-1">
              Yeni istekler geldiğinde burada görünecek
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="border-0 rounded-none">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={request.sender.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {request.sender.display_name?.[0]?.toUpperCase() ||
                        request.sender.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {request.sender.display_name || request.sender.username}
                    </p>
                    <p className="text-sm text-muted-foreground">@{request.sender.username}</p>
                    {request.sender.bio && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {request.sender.bio}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(request.conversation_id)}
                        disabled={actionLoading === request.conversation_id}
                        className="gap-1"
                      >
                        {actionLoading === request.conversation_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Kabul Et
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecline(request.conversation_id)}
                        disabled={actionLoading === request.conversation_id}
                        className="gap-1"
                      >
                        <X className="w-4 h-4" />
                        Reddet
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
