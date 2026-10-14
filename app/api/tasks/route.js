import { connectDB } from "@/lib/mongodb";
import { protect } from "@/middleware/protect";
import {
  createTask,
  getTasks,
} from "@/controllers/task.controller";

export async function GET() {
  await connectDB();

  const user = await protect();

  if (!user) {
    return Response.json(
      { message: "Not authorized" },
      { status: 401 }
    );
  }

  const result = await getTasks(user);

  return Response.json(result.data, {
    status: result.status,
  });
}

export async function POST(request) {
  await connectDB();

  const user = await protect();

  if (!user) {
    return Response.json(
      { message: "Not authorized" },
      { status: 401 }
    );
  }

  const result = await createTask(request, user);

  return Response.json(result.data, {
    status: result.status,
  });
}