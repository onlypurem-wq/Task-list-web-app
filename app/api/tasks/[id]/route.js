import { connectDB } from "@/lib/mongodb";
import { protect } from "@/middleware/protect";
import {
  getTask,
  editTask,
  deleteTask,
} from "@/controllers/task.controller";

export async function GET(request, { params }) {
  await connectDB();

  const user = await protect();

  if (!user) {
    return Response.json(
      { message: "Not authorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const result = await getTask(id, user);

  return Response.json(result.data, {
    status: result.status,
  });
}

export async function PUT(request, { params }) {
  await connectDB();

  const user = await protect();

  if (!user) {
    return Response.json(
      { message: "Not authorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const result = await editTask(request, id, user);

  return Response.json(result.data, {
    status: result.status,
  });
}

export async function DELETE(request, { params }) {
  await connectDB();

  const user = await protect();

  if (!user) {
    return Response.json(
      { message: "Not authorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const result = await deleteTask(id, user);

  return Response.json(result.data, {
    status: result.status,
  });
}