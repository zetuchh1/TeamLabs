"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, Inbox, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import type { Conversation, User, Message, MessageRequest } from "@/lib/types"

type ConversationWithDetails = Conversation & {
  other_user: User
  last_message?: Message
  unread_count: number
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([])
  const [messageRequests, setMessageRequests] = useState<(MessageRequest & { sender: User })[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [convRes, reqRes] = await Promise.all([
          fetch("/api/conversations"),
          fetch("/api/message-requests"),
        ])
        const [convData, reqData] = await Promise.all([convRes.json(), reqRes.json()])

        if (convData.success) {
          setConversations(convData.data)
        }
        if (reqData.success) {
          setMessageRequests(reqData.data)
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Mesajlar</h1>
        </div>
      </header>

      {/* Message Requests */}
      {messageRequests.length > 0 && (
        <Link
          href="/mesajlar/istekler"
          className="flex items-center justify-between p-4 border-b border-border hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Inbox className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Mesaj İstekleri</p>
              <p className="text-sm text-muted-foreground">
                {messageRequests.length} bekleyen istek
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{messageRequests.length}</Badge>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Link>
      )}

      {/* Conversations List */}
      <div className="divide-y divide-border">
        {conversations.length === 0 && messageRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <p className="text-foreground font-medium">Henüz mesajınız yok</p>
            <p className="text-sm text-muted-foreground mt-1">
              Birinin profilinden veya gönderisinden mesaj gönderin
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/mesajlar/${conv.id}`}
              className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={conv.other_user.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {conv.other_user.display_name?.[0]?.toUpperCase() ||
                    conv.other_user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground truncate">
                    {conv.other_user.display_name || conv.other_user.username}
                  </p>
                  {conv.last_message && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conv.last_message.created_at), {
                        addSuffix: false,
                        locale: tr,
                      })}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.last_message ? (
                      <>
                        {conv.last_message.sender_id === user?.id && "Sen: "}
                        {conv.last_message.content}
                      </>
                    ) : (
                      "Henüz mesaj yok"
                    )}
                  </p>
                  {conv.unread_count > 0 && (
                    <Badge variant="default" className="ml-2 shrink-0">
                      {conv.unread_count}
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
