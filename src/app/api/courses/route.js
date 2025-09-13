import { connectToDatabase } from "@/lib/mongoose";
import { Course } from "@/lib/models";

// GET: Return all courses, sorted by newest first
export async function GET() {
  await connectToDatabase();
  const courses = await Course.find().sort({ createdAt: -1 });
  return Response.json(courses);
}

// POST: Create a new course with sell and buy values
export async function POST(req) {
  await connectToDatabase();
  const { name, sell, buy } = await req.json();
  const course = await Course.create({ name, sell, buy });
  return Response.json(course);
}
