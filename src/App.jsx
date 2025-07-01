import { useState, useEffect } from "react";

const TABS = [
  { key: "books", label: "Книги" },
  { key: "movies", label: "Фильмы" },
];

// Описание ачивок для книг
const BOOK_ACHIEVEMENTS = [
  {
    key: "book_first_add",
    label: "Первая книга",
    desc: "Добавь первую книгу",
    icon: "📖",
    check: (books) => books.length >= 1,
  },
  {
    key: "book_collector",
    label: "Книжный червь",
    desc: "Добавь 10 книг",
    icon: "📚",
    check: (books) => books.length >= 10,
  },
  {
    key: "book_critic",
    label: "Книжный критик",
    desc: "Поставь 5 книгам оценку 10/10",
    icon: "🌟",
    check: (books) => books.filter((item) => Number(item.rating) === 10).length >= 5,
  },
  {
    key: "book_detailed",
    label: "Дотошный читатель",
    desc: "Заполни все поля у одной книги",
    icon: "📝",
    check: (books) => books.some(
      (item) => item.title && item.author && item.year && item.comment && item.rating
    ),
  },
];
// Описание ачивок для фильмов
const MOVIE_ACHIEVEMENTS = [
  {
    key: "movie_first_add",
    label: "Первый фильм",
    desc: "Добавь первый фильм",
    icon: "🎬",
    check: (movies) => movies.length >= 1,
  },
  {
    key: "movie_collector",
    label: "Киноман",
    desc: "Добавь 10 фильмов",
    icon: "🍿",
    check: (movies) => movies.length >= 10,
  },
  {
    key: "movie_critic",
    label: "Кинокритик",
    desc: "Поставь 5 фильмам оценку 10/10",
    icon: "🏆",
    check: (movies) => movies.filter((item) => Number(item.rating) === 10).length >= 5,
  },
  {
    key: "movie_detailed",
    label: "Дотошный зритель",
    desc: "Заполни все поля у одного фильма",
    icon: "📝",
    check: (movies) => movies.some(
      (item) => item.title && item.author && item.year && item.comment && item.rating
    ),
  },
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
  const [bookAchievements, setBookAchievements] = useState(() => {
    const saved = localStorage.getItem("bookAchievements");
    return saved ? JSON.parse(saved) : [];
  });
  const [movieAchievements, setMovieAchievements] = useState(() => {
    const saved = localStorage.getItem("movieAchievements");
    return saved ? JSON.parse(saved) : [];
  });
  const [showAchv, setShowAchv] = useState(null); // {type: 'book'|'movie', key: string}

  useEffect(() => {
    saveData(data);
    // Проверка книжных ачивок
    const unlockedBooks = BOOK_ACHIEVEMENTS.filter((a) => a.check(data.books)).map((a) => a.key);
    const newBook = unlockedBooks.filter((key) => !bookAchievements.includes(key));
    if (newBook.length > 0) {
      setBookAchievements(unlockedBooks);
      localStorage.setItem("bookAchievements", JSON.stringify(unlockedBooks));
      setShowAchv({ type: "book", key: newBook[0] });
      setTimeout(() => setShowAchv(null), 3500);
    } else if (unlockedBooks.length !== bookAchievements.length) {
      setBookAchievements(unlockedBooks);
      localStorage.setItem("bookAchievements", JSON.stringify(unlockedBooks));
    }
    // Проверка ачивок фильмов
    const unlockedMovies = MOVIE_ACHIEVEMENTS.filter((a) => a.check(data.movies)).map((a) => a.key);
    const newMovie = unlockedMovies.filter((key) => !movieAchievements.includes(key));
    if (newMovie.length > 0) {
      setMovieAchievements(unlockedMovies);
      localStorage.setItem("movieAchievements", JSON.stringify(unlockedMovies));
      setShowAchv({ type: "movie", key: newMovie[0] });
      setTimeout(() => setShowAchv(null), 3500);
    } else if (unlockedMovies.length !== movieAchievements.length) {
      setMovieAchievements(unlockedMovies);
      localStorage.setItem("movieAchievements", JSON.stringify(unlockedMovies));
    }
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
      {/* Достижения для текущей вкладки */}
      {(tab === "books" || tab === "movies") && (
        <div className="w-full max-w-2xl mb-6">
          <div className="flex flex-col gap-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-700 shadow">
            <div className="font-bold text-lg text-black dark:text-white mb-2 md:mb-0">
              {tab === "books" ? "Достижения — Книги" : "Достижения — Фильмы"}
            </div>
            <div className="flex gap-3 flex-wrap justify-start">
              {(tab === "books" ? BOOK_ACHIEVEMENTS : MOVIE_ACHIEVEMENTS).map((a) => (
                <div key={a.key} className={`flex flex-col items-center text-center ${(tab === "books" ? bookAchievements : movieAchievements).includes(a.key) ? "opacity-100" : "opacity-40"}`} title={a.desc}>
                  <span className="text-2xl md:text-3xl">{a.icon}</span>
                  <span className="text-xs mt-1 font-medium max-w-[80px] text-black dark:text-white">{a.label}</span>
                </div>
              ))}
            </div>
            <div className="w-full mt-2">
              <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={`h-3 transition-all duration-500 ${tab === "books" ? "bg-green-500" : "bg-blue-500"}`}
                  style={{ width: `${((tab === "books" ? bookAchievements.length : movieAchievements.length) / (tab === "books" ? BOOK_ACHIEVEMENTS.length : MOVIE_ACHIEVEMENTS.length)) * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-300 font-semibold">
                {tab === "books" ? bookAchievements.length : movieAchievements.length}/
                {tab === "books" ? BOOK_ACHIEVEMENTS.length : MOVIE_ACHIEVEMENTS.length}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Уведомление о новой ачивке */}
      {showAchv && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg text-lg font-bold flex items-center gap-3 animate-bounce">
          <span className="text-2xl">
            {showAchv.type === 'book'
              ? BOOK_ACHIEVEMENTS.find(a => a.key === showAchv.key).icon
              : MOVIE_ACHIEVEMENTS.find(a => a.key === showAchv.key).icon}
          </span>
          <span>
            Новая ачивка: {showAchv.type === 'book'
              ? BOOK_ACHIEVEMENTS.find(a => a.key === showAchv.key).label
              : MOVIE_ACHIEVEMENTS.find(a => a.key === showAchv.key).label}!
          </span>
        </div>
      )}
      <footer className="mt-10 text-zinc-400 text-base rounded-full px-6 py-2 bg-zinc-50 dark:bg-zinc-900 shadow">by zait • локальное приложение</footer>
    </div>
  );
}

export default App;
