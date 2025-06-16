import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const options = {
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : undefined,
      offset: searchParams.get("offset")
        ? parseInt(searchParams.get("offset")!)
        : undefined,
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      sortBy:
        (searchParams.get("sortBy") as "name" | "created_at") || "created_at",
      sortOrder: (searchParams.get("sortOrder") === "ASC" ? "ASC" : "DESC") as
        | "ASC"
        | "DESC",
    };

    const users = await getAllUsers();

    return NextResponse.json({
      success: true,
      data: users,
      count: Array.isArray(users) ? users.length : 0,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
