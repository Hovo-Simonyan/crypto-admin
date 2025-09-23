import { connectToDatabase } from "@/lib/mongoose";
import { Transaction } from "@/lib/models";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return new Response("Transaction not found", { status: 404 });
    }

    // 204 No Content — удалено успешно
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("🚀 ~ error:", error);
    alert(error.message);
    return new Response("Failed to delete transaction", { status: 500 });
  }
}
