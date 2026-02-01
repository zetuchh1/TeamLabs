"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Gamepad2, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Post, User } from "@/lib/types"

interface PostCardProps {
  post: Post & { user?: User }
  onMessageClick?: (username: string) => void
}

export function PostCard({ post, onMessageClick }: PostCardProps) {
  const user = post.user

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: tr,
  })

  return (
    <Card className="border-border bg-card hover:bg-card/80 transition-colors">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <Link href={`/profil/${user?.username}`} className="shrink-0">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.display_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/profil/${user?.username}`}
                  className="font-semibold text-foreground hover:underline truncate"
                >
                  {user?.display_name || user?.username}
                </Link>
                <Link
                  href={`/profil/${user?.username}`}
                  className="text-sm text-muted-foreground truncate"
                >
                  @{user?.username}
                </Link>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">{timeAgo}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/profil/${user?.username}`}>Profili Görüntüle</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Game Badge */}
            {post.post_type === "looking_for_friend" && post.game_name && (
              <div className="mt-2">
                <Badge variant="secondary" className="gap-1">
                  <Gamepad2 className="w-3 h-3" />
                  {post.game_name}
                </Badge>
              </div>
            )}

            {/* Post Content */}
            <p className="mt-2 text-foreground whitespace-pre-wrap break-words">{post.content}</p>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-2">
              {onMessageClick && user && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => onMessageClick(user.username)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Mesaj Gönder
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
