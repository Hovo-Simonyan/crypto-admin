import { NextResponse } from "next/server";

export async function POST() {
  // Ставим пустой токен и срок жизни = 0
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0, // сразу истекает
  });
  return response;
}
