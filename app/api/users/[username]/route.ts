import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/mock-db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    const user = db.users.findByUsername(username)

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    // Mevcut kullanıcıyı kontrol et
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session_token")?.value
    let currentUserId: number | null = null

    if (sessionToken) {
      const session = db.sessions.get(sessionToken)
      if (session) {
        currentUserId = session.user_id
      }
    }

    // Engel kontrolü
    if (currentUserId && db.blocks.isBlocked(currentUserId, user.id)) {
      return NextResponse.json(
        { success: false, error: "Bu kullanıcı engellenmiş" },
        { status: 403 }
      )
    }

    // Kullanıcı istatistikleri
    const followersCount = db.follows.getFollowersCount(user.id)
    const followingCount = db.follows.getFollowingCount(user.id)
    const posts = db.posts.getByUserId(user.id)

    // Takip durumları
    const isFollowing = currentUserId ? db.follows.isFollowing(currentUserId, user.id) : false
    const isFollowedBy = currentUserId ? db.follows.isFollowing(user.id, currentUserId) : false
    const isBlocked = currentUserId ? db.blocks.isBlocked(currentUserId, user.id) : false

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        followers_count: followersCount,
        following_count: followingCount,
        posts_count: posts.length,
        is_following: isFollowing,
        is_followed_by: isFollowedBy,
        is_blocked: isBlocked,
        posts: posts.map(post => ({
          ...post,
          user,
        })),
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
