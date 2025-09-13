import { connectToDatabase } from "@/lib/mongoose";
import { Client } from "@/lib/models";

// Fetch a client by ID (GET)
export async function GET(req, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();

    // Find the client by ID
    const client = await Client.findById(id).lean();

    if (!client) {
      return new Response("Client not found", { status: 404 });
    }

    // Return client data
    return new Response(JSON.stringify(client), { status: 200 });
  } catch (error) {
    console.error("🚀 ~ error:", error);
    return new Response("Failed to fetch client", { status: 500 });
  }
}

// Update a client (PUT)
export async function PUT(req, { params }) {
  const { id } = params;
  const {
    fullName,
    email,
    phone,
    idCard,
    passport,
    notes,
    status,
    clientBalances,
  } = await req.json();

  try {
    await connectToDatabase();

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        phone,
        idCard,
        passport,
        notes,
        status,
        clientBalances,
      },
      { new: true }
    );

    if (!updatedClient) {
      return new Response("Client not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedClient), { status: 200 });
  } catch (error) {
    console.error("🚀 ~ error:", error);
    return new Response("Failed to update client", { status: 500 });
  }
}

// Delete a client (DELETE)
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();
    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return new Response("Client not found", { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("🚀 ~ error:", error);
    return new Response("Failed to delete client", { status: 500 });
  }
}
