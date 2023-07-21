import { NextResponse } from "next/server"

const GET_COLORS = "https://api.sherwin-williams.com/prism/v1/colors/sherwin"

export async function GET() {
  const res = await fetch(GET_COLORS)
  const json = await res.json()
  return NextResponse.json(json)
}
