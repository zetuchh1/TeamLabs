import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/mock-db"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email ve şifre gerekli" },
        { status: 400 }
      )
    }

    const user = await db.users.verifyPassword(email, password)

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Geçersiz email veya şifre" },
        { status: 401 }
      )
    }

    if (!user.email_verified) {
      return NextResponse.json(
        { success: false, error: "Lütfen email adresinizi doğrulayın" },
        { status: 403 }
      )
    }

    // Oturum oluştur
    const sessionToken = db.sessions.create(user.id)

    // Cookie ayarla
    const cookieStore = await cookies()
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 gün
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
