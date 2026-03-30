import { NextRequest, NextResponse } from "next/server"
import { requireAdmin, AuthError } from "@/lib/auth/middleware"
import { getConfig, setConfig } from "@/lib/admin/config"

export async function GET() {
  try {
    await requireAdmin()

    return NextResponse.json({
      registrationOpen: getConfig("registration_open") === "true",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()

    if (typeof body.registrationOpen === "boolean") {
      setConfig("registration_open", body.registrationOpen ? "true" : "false")
    }

    return NextResponse.json({
      registrationOpen: getConfig("registration_open") === "true",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
