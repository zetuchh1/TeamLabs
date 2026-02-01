"use client"

import React from "react"

import { useEffect, useState, useRef, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, ArrowLeft, Send, MoreVertical, Ban, UserMinus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Message, User, Conversation } from "@/lib/types"

type ConversationWithDetails = Conversation & {
  other_user: User
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [conversation, setConversation] = useState<ConversationWithDetails | null>(null)
  const [messages, setMessages] = useState<(Message & { sender?: User })[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/conversations/${id}/messages`)
      const data = await res.json()
      if (data.success) {
        setMessages(data.data)
      }
      
      // Also fetch conversation details
      const convRes = await fetch("/api/conversations")
      const convData = await convRes.json()
      if (convData.success) {
        const conv = convData.data.find((c: ConversationWithDetails) => c.id === parseInt(id))
        if (conv) {
          setConversation(conv)
        }
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    try {
      const res = await fetch(`/api/conversations/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setMessages((prev) => [...prev, data.data])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleBlock = async () => {
    if (!conversation?.other_user) return
    try {
      await fetch(`/api/users/${conversation.other_user.username}/block`, {
        method: "POST",
      })
      router.push("/mesajlar")
    } catch (error) {
      console.error("Failed to block user:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const otherUser = conversation?.other_user

  return (
    <div className="flex flex-col h-screen lg:h-[calc(100vh)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/mesajlar")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            {otherUser && (
              <Link href={`/profil/${otherUser.username}`} className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={otherUser.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {otherUser.display_name?.[0]?.toUpperCase() ||
                      otherUser.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {otherUser.display_name || otherUser.username}
                  </p>
                  <p className="text-xs text-muted-foreground">@{otherUser.username}</p>
                </div>
              </Link>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/profil/${otherUser?.username}`}>
                  Profili Görüntüle
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleBlock} className="text-destructive">
                <Ban className="w-4 h-4 mr-2" />
                Engelle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Henüz mesaj yok</p>
            <p className="text-sm text-muted-foreground mt-1">
              Sohbeti başlatmak için bir mesaj gönderin
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === user?.id
            return (
              <div
                key={message.id}
                className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}
              >
                {!isOwn && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarImage src={message.sender?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {message.sender?.display_name?.[0]?.toUpperCase() ||
                        message.sender?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2",
                    isOwn
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  )}
                >
                  <p className="break-words">{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    {formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="shrink-0 border-t border-border p-4 bg-background">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Input
            placeholder="Mesajınızı yazın..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-input border-border"
            disabled={isSending}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || isSending}>
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
