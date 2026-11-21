import React, { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  isCompleted: boolean;
};

type Filter = "all" | "active" | "isCompleted";

const localData = localStorage.getItem("todos");

function App() {
  const [todos, setTodos] = useState<Todo[]>(
    localData ? JSON.parse(localData) : [],
  );
  const [filter, setFilter] = useState<Filter>("all");
  const [editId, setEditId] = useState<null | number>(null)
  const [title, setTitle] = useState<string>("");
  const [inlineEditId, setInlineEditId] = useState<null | number>(null);
  const [inlineTitle, setInlineTitle] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId) {
      setTodos((prev) => prev.map((item) => item.id === editId ? { ...item, title } : item));
      setEditId(null);
      setTitle("")
    } else {
      let todo = {
        id: Date.now(),
        title,
        isCompleted: false,
      };
      setTodos((prev) => [...prev, todo]);
    }
    setTitle("");
  };

  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (todo: Todo) => {
    setTitle(todo.title)
    setEditId(todo.id)
  };

  const handleReset = () => {
    setTitle("")
    setEditId(null)
  }

  const handleCompleted = (id: number) => {
    setTodos((prev) => prev.map((item) => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
  }

  const handleInlineSave = (id: number) => {
    setTodos((prev) => prev.map((item) => item.id === id ? { ...item, title: inlineTitle } : item));
    setInlineEditId(null);
    setInlineTitle("");
  };

  const totalCount = todos.length;
  const activeCount = todos.filter((item) => !item.isCompleted).length;
  const completedCount = todos.filter((item) => item.isCompleted).length;

  return (
    <div className="container max-w-7xl mx-auto my-10">
      <h2 className="text-4xl font-bold text-blue-700 mb-4">Ro'yxat</h2>
      <form onSubmit={addTodo} className="w-full">
        <input
          type="text"
          className="p-2 rounded-2xl bg-white font-mono w-[50%] mb-2"
          placeholder="Ro'yxatga qo'shing..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="ms-4 bg-green-600 py-2 px-5 rounded-xl">
          {editId ? "Ro'yxatga o'zgartirish" : "Ro'yxatni qo'shish"}
        </button>
        <button type="reset" className="ms-4 bg-yellow-500 py-2 px-5 rounded-xl"
          onClick={() => { handleReset() }}>
          Qaytarish
        </button>
      </form>
      <div className="flex items-center mt-3">
        <button onClick={() => setFilter("all")} className="bg-indigo-600 py-2 px-5 rounded-xl">Hammasi</button>
        <button onClick={() => setFilter("active")} className="ms-4 bg-indigo-600 py-2 px-5 rounded-xl">Tugatilmaganlar</button>
        <button onClick={() => setFilter("isCompleted")} className="ms-4 bg-indigo-600 py-2 px-5 rounded-xl">Tugatilganlar</button>
        <input
          type="text"
          className="ms-4 p-2 rounded-2xl bg-white font-mono"
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div>
        {todos.length > 0 ? (todos
          .filter((element) => filter === "all" ? true : filter === "active" ? !element.isCompleted : element.isCompleted)
          .filter((element) => element.title.toLowerCase().includes(search.toLowerCase()))
          .map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-blue-950 p-5 5 rounded-2xl mt-2"
            >
              <div className={item.isCompleted ? "left flex items-center gap-5 text-red-700 line-through " : "left flex items-center gap-5 text-white"}>
                <input checked={item.isCompleted} type="checkbox" onClick={() => handleCompleted(item.id)} />
                {inlineEditId === item.id ? (
                  <input
                    type="text"
                    className="p-1 rounded-lg bg-white text-black font-mono"
                    value={inlineTitle}
                    onChange={(e) => setInlineTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleInlineSave(item.id);
                    }}
                    autoFocus
                  />
                ) : (
                  <h4
                    className="font-mono text-8.5 cursor-pointer"
                    onClick={() => {
                      setInlineEditId(item.id);
                      setInlineTitle(item.title);
                    }}
                  >
                    {item.title}
                  </h4>
                )}
              </div>
              <div className="">
                <button className="ms-4 bg-yellow-500 py-2 px-5 rounded-xl"
                  onClick={() => handleEdit(item)}>
                  O'zgartirish
                </button>
                <button
                  className="ms-4 bg-red-600 py-2 px-5 rounded-xl"
                  onClick={() => handleDelete(item.id)}>
                  O'chirish
                </button>
              </div>
            </div>
          ))) :
          <h1 className="p-2 rounded-2xl bg-white font-mono mt-3">Hozircha ro'yxat yo'q</h1>
        }
      </div>
      <div className="mt-6 p-4 bg-indigo-900 text-white rounded-2xl flex items-center justify-around font-mono">
        <span>Hammasi: {totalCount}</span>
        <span>Tugatilmaganlar: {activeCount}</span>
        <span>Tugatilganlar: {completedCount}</span>
      </div>
    </div >
  );
}

export default App;