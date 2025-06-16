import { NextRequest, NextResponse } from "next/server";
import { createSampleOrders } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    await createSampleOrders();
    
    return NextResponse.json({ 
      success: true, 
      message: "Sample orders created successfully" 
    });
  } catch (error) {
    console.error("Error creating sample orders:", error);
    return NextResponse.json(
      { error: "Failed to create sample orders" }, 
      { status: 500 }
    );
  }
}
