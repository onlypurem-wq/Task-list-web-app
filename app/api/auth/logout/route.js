import { logoutUser } from "@/controllers/user.controller";

export async function POST() {
  const result = await logoutUser();

  return Response.json(result.data, {
    status: result.status,
  });
}