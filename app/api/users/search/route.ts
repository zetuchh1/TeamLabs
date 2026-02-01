import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const users = db.users.search(query.trim())

    return NextResponse.json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error("Search users error:", error)
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
