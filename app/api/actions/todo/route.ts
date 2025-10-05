import { NextResponse } from "next/server";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

// Simple in-memory storage (replace with database in production)
const todos: Todo[] = [];

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const todo: Todo = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };

    todos.push(todo);
    
    return NextResponse.json({
      message: `Todo created: "${title}"`,
      todo,
      totalTodos: todos.length
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ todos, count: todos.length });
}