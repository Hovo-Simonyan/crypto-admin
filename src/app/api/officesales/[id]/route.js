import { connectToDatabase } from "@/lib/mongoose";
import { OfficeSale } from "@/lib/models";

// ===== GET: Получить один офисный расход =====
export async function GET(req, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();

    const sale = await OfficeSale.findById(id).lean();

    if (!sale) {
      return new Response("OfficeSale not found", { status: 404 });
    }

    return new Response(JSON.stringify(sale), { status: 200 });
  } catch (error) {
    console.error("🚀 ~ error:", error);
    alert(error.message);
    return new Response("Failed to fetch office sale", { status: 500 });
  }
}

// ===== PUT: Обновить офисный расход =====
export async function PUT(req, { params }) {
  const { id } = params;
  const { title, description, amount, currency, method, date, notes } =
    await req.json();

  try {
    await connectToDatabase();

    const updatedSale = await OfficeSale.findByIdAndUpdate(
      id,
      {
        title,
        description,
        amount,
        currency,
        method,
        date,
        notes,
      },
      { new: true }
    );

    if (!updatedSale) {
      return new Response("OfficeSale not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedSale), { status: 200 });
  } catch (error) {
    console.error("🚀 ~ error:", error);
    alert(error.message);
    return new Response("Failed to update office sale", { status: 500 });
  }
}

// ===== DELETE: Удалить офисный расход =====
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();
    const deletedSale = await OfficeSale.findByIdAndDelete(id);

    if (!deletedSale) {
      return new Response("OfficeSale not found", { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("🚀 ~ error:", error);
    alert(error.message);
    return new Response("Failed to delete office sale", { status: 500 });
  }
}
