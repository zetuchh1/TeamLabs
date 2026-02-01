import { NextResponse } from "next/server"
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

    const followers = db.follows.getFollowers(user.id)

    return NextResponse.json({
      success: true,
      data: followers,
    })
  } catch (error) {
    console.error("Get followers error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
