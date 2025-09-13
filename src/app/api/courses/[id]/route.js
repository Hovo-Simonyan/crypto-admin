import { connectToDatabase } from "@/lib/mongoose";
import { Course } from "@/lib/models";

// PUT: Update course by ID
export async function PUT(req, { params }) {
  await connectToDatabase();
  const { id } = params;
  const { name, sell, buy } = await req.json();

  const updated = await Course.findByIdAndUpdate(
    id,
    { name, sell, buy },
    { new: true }
  );

  return Response.json(updated);
}

// DELETE: Delete course by ID
export async function DELETE(_, { params }) {
  await connectToDatabase();
  const { id } = params;
  await Course.findByIdAndDelete(id);
  return new Response(null, { status: 204 });
}
