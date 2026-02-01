"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Search, Users } from "lucide-react"
import type { User } from "@/lib/types"

export default function ExplorePage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if (data.success) {
        setResults(data.data)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Keşfet</h1>
        </div>
      </header>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Kullanıcı ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>
          <Button type="submit" disabled={!query.trim() || isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ara"}
          </Button>
        </form>
      </div>

      {/* Results */}
      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <p className="text-foreground font-medium">Kullanıcı bulunamadı</p>
            <p className="text-sm text-muted-foreground mt-1">
              Farklı bir arama terimi deneyin
            </p>
          </div>
        ) : !hasSearched ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <p className="text-foreground font-medium">Kullanıcı Ara</p>
            <p className="text-sm text-muted-foreground mt-1">
              Yeni arkadaşlar bul ve takip et
            </p>
          </div>
        ) : (
          results.map((user) => (
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
