import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Balance } from "@/lib/models";

// ===== GET =====
export async function GET() {
  await connectToDatabase();
  const balances = await Balance.find({});
  return NextResponse.json(balances); // вернёт все кошельки со всеми валютами
}

// ===== POST =====
export async function POST(req) {
  try {
    const { name, image, balances } = await req.json();
    await connectToDatabase();

    // balances ожидается в виде массива объектов { currency, amount }
    const newBalance = new Balance({
      name,
      image,
      balances: balances.map((b) => ({
        currency: b.currency,
        amount: parseFloat(b.amount),
      })),
    });
    await newBalance.save();

    return NextResponse.json(newBalance, { status: 201 });
  } catch (error) {
    console.error("POST Balance Error:", error);
    alert(error.message)
    return NextResponse.json(
      { error: "Error creating balance" },
      { status: 500 }
    );
  }
}
