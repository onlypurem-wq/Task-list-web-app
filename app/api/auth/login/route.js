import { loginUser } from "@/controllers/user.controller";
import { connectDB } from "@/lib/mongodb";

export async function POST(request) {
  try {
    await connectDB();
  } catch (error) {
    return Response.json(
      { message: "Database connection failed" },
      { status: 503 }
    );
  }

  const result = await loginUser(request);

  return Response.json(result.data, {
    status: result.status,
  });
}