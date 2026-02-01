import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/mock-db"

// Mesaj isteğini kabul et
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

    const success = db.messageRequests.accept(conversationId, session.user_id)

    if (!success) {
      return NextResponse.json(
        { success: false, error: "İstek bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Mesaj isteği kabul edildi",
    })
  } catch (error) {
    console.error("Accept message request error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}

// Mesaj isteğini reddet
export async function DELETE(
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

    const success = db.messageRequests.decline(conversationId, session.user_id)

    if (!success) {
      return NextResponse.json(
        { success: false, error: "İstek bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Mesaj isteği reddedildi",
    })
  } catch (error) {
    console.error("Decline message request error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
