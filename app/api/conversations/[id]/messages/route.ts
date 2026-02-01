import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/mock-db"

// Mesajları getir
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params
    const conversationId = parseInt(id)

    const messages = db.messages.getByConversationId(conversationId)

    // Mesajları okundu olarak işaretle
    db.messages.markAsRead(conversationId, session.user_id)

    // Her mesaj için gönderen bilgisini ekle
    const messagesWithSenders = messages.map(message => ({
      ...message,
      sender: db.users.findById(message.sender_id),
    }))

    return NextResponse.json({
      success: true,
      data: messagesWithSenders,
    })
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}

// Yeni mesaj gönder
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params
    const conversationId = parseInt(id)
    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Mesaj boş olamaz" },
        { status: 400 }
      )
    }

    const message = db.messages.create({
      conversation_id: conversationId,
      sender_id: session.user_id,
      content: content.trim(),
    })

    return NextResponse.json({
      success: true,
      data: {
        ...message,
        sender: db.users.findById(session.user_id),
      },
    })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
