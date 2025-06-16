import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { user_id, currentPassword, newPassword } = await req.json();

    if (!user_id || !currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing fields: user_id, currentPassword, or newPassword",
        },
        { status: 400 }
      );
    }

    // Lấy mật khẩu hiện tại từ DB
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

    // Hash mật khẩu mới
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await pool.execute(`UPDATE users SET password_hash = ? WHERE id = ?`, [
      newPasswordHash,
      user_id,
    ]);

    return NextResponse.json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
