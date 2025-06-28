import { useState, useEffect } from "react";

const TABS = [
  { key: "books", label: "Книги" },
  { key: "movies", label: "Фильмы" },
];

function getInitialData() {
  const data = localStorage.getItem("mediaData");
  return data ? JSON.parse(data) : { books: [], movies: [] };
}

function saveData(data) {
  localStorage.setItem("mediaData", JSON.stringify(data));
}

function App() {
  const [tab, setTab] = useState("books");
  const [data, setData] = useState(getInitialData());
  const [form, setForm] = useState({
    title: "",
    author: "",
    year: "",
    comment: "",
    rating: "",
  });
  const [editIdx, setEditIdx] = useState(null);
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.rating) return;
    const item = { ...form };
    if (editIdx !== null) {
      const updated = [...data[tab]];
      updated[editIdx] = item;
      setData({ ...data, [tab]: updated });
      setEditIdx(null);
    } else {
      setData({ ...data, [tab]: [item, ...data[tab]] });
    }
    setForm({ title: "", author: "", year: "", comment: "", rating: "" });
  };

  const handleEdit = (idx) => {
    setForm(data[tab][idx]);
    setEditIdx(idx);
  };

  const handleDelete = (idx) => {
    const updated = data[tab].filter((_, i) => i !== idx);
    setData({ ...data, [tab]: updated });
    if (editIdx === idx) setEditIdx(null);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center py-8 px-2 transition-colors duration-300 ${dark ? "bg-black" : "bg-white"}`}>
      <div className="w-full max-w-2xl rounded-3xl shadow-2xl p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-center text-black dark:text-white tracking-tight rounded-2xl px-4 py-2">
            Моя коллекция
          </h1>
          <button
            className="ml-4 px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-base font-semibold shadow hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
            onClick={() => setDark((d) => !d)}
            title="Переключить тему"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
        <div className="flex justify-center gap-4 mb-10">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 border-2 text-lg shadow-sm ${
                tab === t.key
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  : "bg-white text-black border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-800"
              }`}
              onClick={() => {
                setTab(t.key);
                setForm({ title: "", author: "", year: "", comment: "", rating: "" });
                setEditIdx(null);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={tab === "books" ? "Название книги" : "Название фильма"}
            className="col-span-1 md:col-span-2 px-6 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none text-lg shadow-sm"
            required
          />
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder={tab === "books" ? "Автор" : "Режиссёр"}
            className="px-6 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none text-lg shadow-sm"
          />
          <input
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="Год"
            className="px-6 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none text-lg shadow-sm"
            type="number"
            min="1800"
            max={new Date().getFullYear()}
          />
          <input
            name="rating"
            value={form.rating}
            onChange={handleChange}
            placeholder="Оценка (1-10)"
            className="px-6 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none text-lg shadow-sm"
            type="number"
            min="1"
            max="10"
            required
          />
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            placeholder="Комментарий"
            className="col-span-1 md:col-span-2 px-6 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none resize-none text-lg shadow-sm"
            rows={2}
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform border border-black dark:border-white text-lg"
          >
            {editIdx !== null ? "Сохранить" : "Добавить"}
          </button>
        </form>
        <div>
          {data[tab].length === 0 ? (
            <div className="text-center text-zinc-400 py-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800">Пока ничего нет...</div>
          ) : (
            <ul className="space-y-6">
              {data[tab].map((item, idx) => (
                <li
                  key={idx}
                  className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-zinc-200 dark:border-zinc-700"
                >
                  <div>
                    <div className="text-xl font-semibold text-black dark:text-white rounded-xl">
                      {item.title}
                    </div>
                    <div className="text-base text-zinc-500 dark:text-zinc-400 rounded-xl">
                      {tab === "books" ? "Автор" : "Режиссёр"}: {item.author || "—"}
                      {item.year && (
                        <span className="ml-2">({item.year})</span>
                      )}
                    </div>
                    <div className="mt-2 text-base text-zinc-700 dark:text-zinc-300 rounded-xl">
                      {item.comment}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 min-w-[90px]">
                    <span className="inline-block bg-black dark:bg-white text-white dark:text-black rounded-full px-5 py-2 text-base font-bold border border-black dark:border-white shadow">
                      {item.rating} / 10
                    </span>
                    <div className="flex gap-3">
                      <button
                        className="text-black dark:text-white hover:text-zinc-700 dark:hover:text-zinc-300 font-bold rounded-full p-2 transition"
                        onClick={() => handleEdit(idx)}
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      <button
                        className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white font-bold rounded-full p-2 transition"
                        onClick={() => handleDelete(idx)}
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <footer className="mt-10 text-zinc-400 text-base rounded-full px-6 py-2 bg-zinc-50 dark:bg-zinc-900 shadow">by zait • локальное приложение</footer>
    </div>
  );
}

export default App;
