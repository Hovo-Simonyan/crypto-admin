import { connectToDatabase } from "@/lib/mongoose";
import { Transaction } from "@/lib/models";

// Fetch all transactions for a given clientId (GET)
export async function GET(req, { params }) {
  const { clientId } = await params; // The clientId from the URL params

  try {
    await connectToDatabase();

    // Find all transactions by clientId
    const transactions = await Transaction.find({ clientId }).lean(); // Use lean() to return plain JavaScript objects

    return new Response(JSON.stringify(transactions), { status: 200 });
  } catch (error) {
    console.error("🚀 ~ error:", error);
    alert(error.message);
    return new Response("Failed to fetch transactions", { status: 500 });
  }
}
