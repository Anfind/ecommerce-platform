import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { user_id, currentPassword } = await req.json();

    if (!user_id || !currentPassword) {
      return NextResponse.json(
        { success: false, error: "Missing user_id or currentPassword" },
        { status: 400 }
      );
    }

    const [rows]: any[] = await pool.execute(
      `SELECT password_hash FROM users WHERE id = ?`,
      [user_id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      rows[0].password_hash
    );

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Mật khẩu hiện tại không đúng" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, message: "Mật khẩu chính xác" });
  } catch (error) {
    console.error("Error verifying password:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
