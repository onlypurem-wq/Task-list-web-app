import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/user.model";

export async function protect() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    if (!process.env.JWT_SECRET) {
      console.error("protect: JWT_SECRET is not defined in .env.local");
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // works with either payload shape: { id } or { userId }
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return null;
    }

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    // expired or invalid tokens land here; that's normal, so stay quiet
    if (
      error.name !== "JsonWebTokenError" &&
      error.name !== "TokenExpiredError"
    ) {
      console.error("protect error:", error);
    }
    return null;
  }
}