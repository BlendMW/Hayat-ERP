// App.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { IntlProvider } from './components/IntlProvider';
import { HayatBookingFlow } from './components/common/HayatBookingFlow';
import { useLocale } from './hooks/useLocale';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource"; // Adjust the path as per your project structure

const client = generateClient<Schema>();

const App: React.FC = () => {
  const { locale, setLocale } = useLocale();
  const [todos, setTodos] = useState([]);

  // Fetch todos when the component mounts
  useEffect(() => {
    async function fetchTodos() {
      try {
        const { data } = await client.models.Todo.list();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }

    fetchTodos();
  }, []);

  // Function to add a new todo
  const addTodo = async (content: string) => {
    try {
      const newTodo = await client.models.Todo.create({ content, isDone: false });
      setTodos([...todos, newTodo]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Function to toggle the completion status of a todo
  const toggleTodo = async (id: string, isDone: boolean) => {
    try {
      const updatedTodo = await client.models.Todo.update(id, { isDone: !isDone });
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Function to delete a todo
  const deleteTodo = async (id: string) => {
    try {
      await client.models.Todo.delete(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <IntlProvider locale={locale}>
      <div className="app">
        <button onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}>
          Switch to {locale === 'en' ? 'Arabic' : 'English'}
        </button>
        <HayatBookingFlow userType="b2c" />

        {/* Todo List Section */}
        <div>
          <h2>Todo List</h2>
          <AddTodoForm addTodo={addTodo} />
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                <span
                  style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}
                  onClick={() => toggleTodo(todo.id, todo.isDone)}
                >
                  {todo.content}
                </span>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        {/* End of Todo List Section */}
      </div>
    </IntlProvider>
  );
};

export default App;

// Component for adding a new todo
function AddTodoForm({ addTodo }: { addTodo: (content: string) => void }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      addTodo(content.trim());
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New todo..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}
