import { NextResponse } from "next/server";
import { defaultSession, getSession } from "../../../components/Auth/auth_server_lib";

// TODO: Improve CSRF protection for this route

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ isLoggedIn: false });
    }
    return NextResponse.json({
      isLoggedIn: true,
      exp: session.exp,
      userInfo: session.userInfo,
      access_token: session.access_token,
    });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
