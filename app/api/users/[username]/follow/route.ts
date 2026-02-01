import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/mock-db"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
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

    const { username } = await params
    const targetUser = db.users.findByUsername(username)

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    if (targetUser.id === session.user_id) {
      return NextResponse.json(
        { success: false, error: "Kendinizi takip edemezsiniz" },
        { status: 400 }
      )
    }

    // Engel kontrolü
    if (db.blocks.isBlocked(session.user_id, targetUser.id)) {
      return NextResponse.json(
        { success: false, error: "Bu kullanıcı engellenmiş" },
        { status: 403 }
      )
    }

    db.follows.follow(session.user_id, targetUser.id)

    return NextResponse.json({
      success: true,
      message: "Takip edildi",
    })
  } catch (error) {
    console.error("Follow error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
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

    const { username } = await params
    const targetUser = db.users.findByUsername(username)

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    db.follows.unfollow(session.user_id, targetUser.id)

    return NextResponse.json({
      success: true,
      message: "Takip bırakıldı",
    })
  } catch (error) {
    console.error("Unfollow error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
