import { connectToDatabase } from "@/lib/mongoose";
import { OfficeSale } from "@/lib/models";

// GET: Получение всех расходов офиса
export async function GET() {
  try {
    await connectToDatabase();
    const officeSales = await OfficeSale.find().sort({ createdAt: -1 });
    return Response.json(officeSales);
  } catch (error) {
    return Response.json(
      { message: "Failed to fetch office sales", error },
      { status: 500 }
    );
  }
}

// POST: Создание нового расхода офиса
export async function POST(req) {
  try {
    const { title, amount, currency, method, note, date } = await req.json();

    await connectToDatabase();

    const newOfficeSale = new OfficeSale({
      title,
      amount,
      currency,
      method,
      note,
      date, // если не передашь, в схеме будет default: Date.now
    });

    await newOfficeSale.save();

    return new Response(JSON.stringify(newOfficeSale), {
      status: 201,
    });
  } catch (error) {
    alert(error.message);
    console.error("Error creating office sale:", error);
    return new Response("Failed to create office sale", {
      status: 500,
    });
  }
}
