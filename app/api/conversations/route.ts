import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/mock-db"

// Konuşmaları getir
export async function GET() {
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

    const conversations = db.conversations.getByUserId(session.user_id)

    return NextResponse.json({
      success: true,
      data: conversations,
    })
  } catch (error) {
    console.error("Get conversations error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}

// Yeni konuşma başlat
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

    const { username } = await request.json()

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı adı gerekli" },
        { status: 400 }
      )
    }

    const targetUser = db.users.findByUsername(username)
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    if (targetUser.id === session.user_id) {
      return NextResponse.json(
        { success: false, error: "Kendinizle konuşma başlatamazsınız" },
        { status: 400 }
      )
    }

    // Engel kontrolü
    if (db.blocks.isBlocked(session.user_id, targetUser.id)) {
      return NextResponse.json(
        { success: false, error: "Bu kullanıcı ile iletişim kuramazsınız" },
        { status: 403 }
      )
    }

    const { conversation, isNew, needsRequest } = db.conversations.findOrCreate(
      session.user_id,
      targetUser.id
    )

    return NextResponse.json({
      success: true,
      data: {
        ...conversation,
        other_user: targetUser,
        is_new: isNew,
        needs_request: needsRequest,
      },
    })
  } catch (error) {
    console.error("Create conversation error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
