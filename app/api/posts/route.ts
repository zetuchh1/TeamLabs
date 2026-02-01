import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/mock-db"

// Gönderileri getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    const posts = db.posts.getAll({ limit, offset })
    
    // Her post için kullanıcı bilgisini ekle
    const postsWithUsers = posts.map(post => ({
      ...post,
      user: db.users.findById(post.user_id),
    }))

    return NextResponse.json({
      success: true,
      data: postsWithUsers,
    })
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}

// Yeni gönderi oluştur
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session_token")?.value

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Giriş yapmalısınız" },
        { status: 401 }
      )
    }

    const session = db.sessions.get(sessionToken)
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Geçersiz oturum" },
        { status: 401 }
      )
    }

    const { content, post_type, game_name } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "İçerik boş olamaz" },
        { status: 400 }
      )
    }

    if (content.length > 500) {
      return NextResponse.json(
        { success: false, error: "İçerik en fazla 500 karakter olabilir" },
        { status: 400 }
      )
    }

    // Günlük limit kontrolü
    const remaining = db.posts.getRemainingPosts(session.user_id)
    if (remaining <= 0) {
      return NextResponse.json(
        { success: false, error: "Günlük gönderi limitinize ulaştınız (3 gönderi)" },
        { status: 429 }
      )
    }

    const post = db.posts.create({
      user_id: session.user_id,
      content: content.trim(),
      post_type: post_type || "general",
      game_name: game_name || undefined,
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Gönderi oluşturulamadı" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        user: db.users.findById(session.user_id),
      },
      remaining: remaining - 1,
    })
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
