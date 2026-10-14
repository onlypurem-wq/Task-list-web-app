"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskSkeleton from "@/components/TaskSkeleton";

export default function TaskList({ userName }) {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const res = await fetch("/api/tasks");

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setError("");

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, task: details }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Could not add task");
      return;
    }

    setTitle("");
    setDetails("");
    loadTasks();
  }

  async function handleToggle(task) {
    setError("");

    const res = await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !task.done }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (!res.ok) {
      setError("Could not update task");
      return;
    }

    setTasks(
      tasks.map((t) => (t._id === task._id ? { ...t, done: !t.done } : t))
    );
  }

  async function handleDelete(id) {
    setError("");

    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (!res.ok) {
      setError("Could not delete task");
      return;
    }

    setTasks(tasks.filter((t) => t._id !== id));
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function handleHome() {
    router.push("/");
    router.refresh();
  }

  return (
    <main>
      <div className="wrapper tl-container">
        <div className="tl-form-container">
          <header className="tl-header">
            <button className = "Button" onClick = {handleHome}>Home</button>
            <button className="Button" onClick={handleLogout}>
              Log out
            </button>
          </header>

          <div className = "line"></div>

          <div className = "tl-mid">
            <h2>{userName}'s tasks</h2>
            <h3>Enter your tasks</h3>
          </div>

          <form className="tl-form" onSubmit={handleAdd}>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              placeholder="Details (optional)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
            <button className="Button" type="submit">
              Add
            </button>
          </form>
        </div>
        
        <div className="tl-tasks">
          <h1>Your tasks</h1>

          {error && <p className="tl-error">{error}</p>}

          {loading ? (
            <TaskSkeleton />
          ) : tasks.length === 0 ? (
            <p>No tasks yet.</p>
          ) : (
            <ul className="tl-list">
              {tasks.map((t) => (
                <li key={t._id} className="tl-item">
                  <input
                    type="checkbox"
                    className="tl-checkbox"
                    checked={!!t.done}
                    onChange={() => handleToggle(t)}
                  />
                  <div className={`tl-content ${t.done ? "tl-done" : ""}`}>
                    <span className="tl-title">{t.title}</span>
                    {t.task && <span className="tl-details">{t.task}</span>}
                  </div>

                  <button
                    className="tl-delete"
                    onClick={() => handleDelete(t._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
      </div>
    </main>
  );
}