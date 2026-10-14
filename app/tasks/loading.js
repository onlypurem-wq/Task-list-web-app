import TaskSkeleton from "@/components/TaskSkeleton";

export default function Loading() {
  return (
    <div>
      <div
        className="skeleton"
        style={{ width: 200, height: 28, marginBottom: 16 }}
      />
      <TaskSkeleton />
    </div>
  );
}