import { protect } from "@/middleware/protect";
import { getUserProfile } from "@/controllers/user.controller";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
    await connectDB();
    await cookies();
  const user = await protect();

  if (!user) {
    return Response.json(
      { message: "Not authorized" },
      { status: 401 }
    );
  }

  const result = await getUserProfile(user);

  return Response.json(result.data, {
    status: result.status,
  });
}