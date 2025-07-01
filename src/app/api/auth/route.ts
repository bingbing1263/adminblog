import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password === ACCESS_PASSWORD) {
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "2h" });
    return NextResponse.json({ token });
  }
  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
} 