// src/app/api/balances/[id]/route.js

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Balance } from "@/lib/models";

// Ensure that params are awaited
// ===== PUT =====
export async function PUT(req, { params }) {
  const { id } = params;
  const { name, image, balances } = await req.json();
  await connectToDatabase();

  try {
    const updatedBalance = await Balance.findByIdAndUpdate(
      id,
      { name, image, balances },
      { new: true }
    );

    if (!updatedBalance) {
      return NextResponse.json({ error: "Balance not found" }, { status: 404 });
    }
    return NextResponse.json(updatedBalance, { status: 200 });
  } catch (error) {
    console.error("PUT Balance Error:", error);
    return NextResponse.json(
      { error: "Error updating balance" },
      { status: 500 }
    );
  }
}

// ===== DELETE =====
export async function DELETE(req, { params }) {
  const { id } = params;
  await connectToDatabase();

  try {
    const deletedBalance = await Balance.findByIdAndDelete(id);
    if (!deletedBalance) {
      return NextResponse.json({ error: "Balance not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Balance deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Balance Error:", error);
    return NextResponse.json(
      { error: "Error deleting balance" },
      { status: 500 }
    );
  }
}
