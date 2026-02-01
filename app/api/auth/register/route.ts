import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function POST(request: Request) {
  try {
    const { username, email, password, display_name } = await request.json()

    // Validasyon
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Tüm alanları doldurun" },
        { status: 400 }
      )
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı adı 3-50 karakter arasında olmalı" },
        { status: 400 }
      )
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Şifre en az 6 karakter olmalı" },
        { status: 400 }
      )
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Geçerli bir email adresi girin" },
        { status: 400 }
      )
    }

    // Kullanıcı adı kontrolü
    const existingUsername = db.users.findByUsername(username)
    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: "Bu kullanıcı adı zaten kullanımda" },
        { status: 409 }
      )
    }

    // Email kontrolü
    const existingEmail = db.users.findByEmail(email)
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Bu email adresi zaten kullanımda" },
        { status: 409 }
      )
    }

    // Kullanıcı oluştur
    const user = await db.users.create({
      username,
      email,
      password,
      display_name: display_name || username,
    })

    // Demo için email'i otomatik doğrula
    db.users.update(user.id, { email_verified: true })

    return NextResponse.json({
      success: true,
      message: "Hesabınız oluşturuldu. Lütfen email adresinizi doğrulayın.",
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
