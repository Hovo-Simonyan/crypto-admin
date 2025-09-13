import { connectToDatabase } from "@/lib/mongoose";
import { Client } from "@/lib/models";

// GET: Получение всех клиентов
export async function GET() {
  try {
    await connectToDatabase();
    const clients = await Client.find().sort({ createdAt: -1 });
    return Response.json(clients);
  } catch (error) {
    return Response.json(
      { message: "Failed to fetch clients", error },
      { status: 500 }
    );
  }
}

// POST: Создание нового клиента
export async function POST(req) {
  try {
    const { fullName, email, phone, idCard, passport, notes, status } =
      await req.json();

    await connectToDatabase();

    const newClient = new Client({
      fullName,
      email,
      phone,
      idCard,
      passport,
      notes, // по умолчанию пустая строка
      status, // по умолчанию normal
    });

    await newClient.save();

    return new Response(JSON.stringify(newClient), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return new Response("Failed to create client", {
      status: 500,
    });
  }
}
