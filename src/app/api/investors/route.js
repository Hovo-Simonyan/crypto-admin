// app/api/investors/route.js
import { connectToDatabase } from "@/lib/mongoose";
import { Investor } from "@/lib/models";

export async function GET() {
  try {
    await connectToDatabase();
    const investors = await Investor.find().lean();
    return new Response(JSON.stringify(investors), { status: 200 });
  } catch (err) {
    console.error(err);
    alert(err.message);
    return new Response("Failed to fetch investors", { status: 500 });
  }
}

export async function POST(req) {
  const data = await req.json();
  try {
    await connectToDatabase();
    const investor = await Investor.create(data);
    return new Response(JSON.stringify(investor), { status: 201 });
  } catch (err) {
    console.error(err);
    alert(err.message);
    return new Response("Failed to create investor", { status: 500 });
  }
}
