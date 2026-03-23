import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ListTodo, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "momentum-todos";

function readTodos() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [todos, setTodos] = useState(() => readTodos());
  const [draft, setDraft] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    return {
      total: todos.length,
      completed,
      remaining: todos.length - completed,
    };
  }, [todos]);

  function addTodo(event) {
    event.preventDefault();
    const title = draft.trim();

    if (!title) {
      return;
    }

    setTodos((current) => [
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: Date.now(),
      },
      ...current,
    ]);
    setDraft("");
  }

  function toggleTodo(id) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function deleteTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  function clearCompleted() {
    setTodos((current) => current.filter((todo) => !todo.completed));
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="overflow-hidden rounded-[28px] border border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(241,245,249,0.88)_48%,_rgba(226,232,240,0.8)_100%)] p-8 shadow-glow">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-5">
              <Badge className="w-fit gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                <Sparkles className="h-3.5 w-3.5" />
                Persistent Todo App
              </Badge>
              <div className="space-y-3">
                <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                  Keep your tasks sharp, visible, and saved.
                </h1>
                <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
                  Momentum is a focused todo workspace built with React and Shadcn UI components.
                  Everything persists in local storage, so your list is still here when you come back.
                </p>
              </div>
              <form className="flex flex-col gap-3 sm:flex-row" onSubmit={addTodo}>
                <Input
                  aria-label="New todo"
                  className="h-12 border-slate-200 bg-white/90 text-base"
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="What needs to get done?"
                  value={draft}
                />
                <Button className="h-12 min-w-32 bg-slate-950 text-white hover:bg-slate-800" type="submit">
                  Add Task
                </Button>
              </form>
            </div>

            <Card className="border-white/70 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Today&apos;s pace</CardTitle>
                <CardDescription>Track your task load at a glance.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-950 p-4 text-white">
                  <p className="text-sm text-slate-300">Total</p>
                  <p className="mt-2 text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="rounded-xl bg-emerald-100 p-4 text-emerald-950">
                  <p className="text-sm text-emerald-800">Done</p>
                  <p className="mt-2 text-3xl font-bold">{stats.completed}</p>
                </div>
                <div className="rounded-xl bg-amber-100 p-4 text-amber-950">
                  <p className="text-sm text-amber-800">Left</p>
                  <p className="mt-2 text-3xl font-bold">{stats.remaining}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Card className="border-slate-200/80 bg-white/90 backdrop-blur">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ListTodo className="h-5 w-5 text-slate-500" />
                Task list
              </CardTitle>
              <CardDescription>Your todos stay in this browser until you remove them.</CardDescription>
            </div>
            <Button
              className="border-slate-200"
              disabled={stats.completed === 0}
              onClick={clearCompleted}
              variant="outline"
            >
              Clear completed
            </Button>
          </CardHeader>
          <CardContent>
            {todos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-slate-300" />
                <h2 className="mt-4 text-xl font-semibold text-slate-900">Nothing in the queue</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Add your first task above. It will persist automatically in local storage.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {todos.map((todo) => (
                  <li
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300"
                    key={todo.id}
                  >
                    <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
                    <div className="min-w-0 flex-1">
                      <p
                        className={
                          todo.completed
                            ? "truncate text-sm text-slate-400 line-through sm:text-base"
                            : "truncate text-sm font-medium text-slate-900 sm:text-base"
                        }
                      >
                        {todo.title}
                      </p>
                    </div>
                    <Button
                      aria-label={`Delete ${todo.title}`}
                      onClick={() => deleteTodo(todo.id)}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4 text-slate-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
