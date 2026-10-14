import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="container homeContainer">
        <div className = "head">
          <div className="wrapper">
          <h2 className="tasker">Tasker</h2>
            <img src="https://img.icons8.com/ios/50/null/task.png" alt="Tasker Logo" class = "taskerLogo" />
          </div>
          <h1>Task Management WebApp</h1>
        </div>

        <div className = "wrapper enterButtons">
          <button className="Button">
            <Link href="/signup">Signup</Link>
          </button>

          <button className="Button">
            <Link href="/login">Login</Link>
          </button>
        </div>
      </div>
    </main>
  );
}