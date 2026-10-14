import { createUser } from "@/controllers/user.controller";
import { connectDB } from "@/lib/mongodb";

export async function POST(request) {
  await connectDB();
  const result = await createUser(request);

  return Response.json(result.data, {
    status: result.status,
  });
}