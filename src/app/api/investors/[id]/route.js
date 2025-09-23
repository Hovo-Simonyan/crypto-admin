// app/api/investors/[id]/route.js
import { connectToDatabase } from "@/lib/mongoose";
import { Investor } from "@/lib/models";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const investor = await Investor.findById(params.id).lean();
    if (!investor) return new Response("Investor not found", { status: 404 });
    return new Response(JSON.stringify(investor), { status: 200 });
  } catch (err) {
    console.error(err);
    alert(err.message);
    return new Response("Failed to fetch investor", { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const data = await req.json();
  try {
    await connectToDatabase();
    const updated = await Investor.findByIdAndUpdate(params.id, data, {
      new: true,
    });
    if (!updated) return new Response("Investor not found", { status: 404 });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error(err);
    alert(err.message);
    return new Response("Failed to update investor", { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const deleted = await Investor.findByIdAndDelete(params.id);
    if (!deleted) return new Response("Investor not found", { status: 404 });
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(err);
    alert(err.message);
    return new Response("Failed to delete investor", { status: 500 });
  }
}
