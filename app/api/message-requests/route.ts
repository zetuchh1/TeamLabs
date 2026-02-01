import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/mock-db"

// Mesaj isteklerini getir
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

    const requests = db.messageRequests.getPending(session.user_id)

    return NextResponse.json({
      success: true,
      data: requests,
    })
  } catch (error) {
    console.error("Get message requests error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
