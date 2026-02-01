import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/mock-db"

export async function PATCH(request: Request) {
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

    const { display_name, bio, is_private } = await request.json()

    const updatedUser = db.users.update(session.user_id, {
      display_name: display_name?.trim() || undefined,
      bio: bio?.trim() || undefined,
      is_private: is_private !== undefined ? is_private : undefined,
    })

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
