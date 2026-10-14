import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { protect } from "@/middleware/protect";
import TaskList from "@/components/TaskList";
import { connection } from "next/server";

export default async function TasksPage() {
    await connection(); // Ensure the database connection is established
  await connectDB();
  const user = await protect();

  if (!user) {
    redirect("/login");
  }

  return <TaskList userName={user.name} />;
}