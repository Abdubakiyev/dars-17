import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState("login"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  function readUsers() {
    try {
      return JSON.parse(localStorage.getItem("users") || "[]");
    } catch {
      return [];
    }
  }

  function writeUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function validateEmail(v) {
    return /\S+@\S+\.\S+/.test(v);
  }

  function handleSwitch(next) {
    setMode(next);
    resetMessages();
    setEmail("");
    setPassword("");
    setConfirm("");
  }

  function handleRegister(e) {
    e.preventDefault();
    resetMessages();

    if (!validateEmail(email)) return setError("Email noto'g'ri formatda");
    if (password.length < 6) return setError("Parol kamida 6 belgidan iborat bo'lsin");
    if (password !== confirm) return setError("Parollar mos emas");

    const users = readUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return setError("Bu email allaqachon ro'yxatdan o'tgan");

    const newUser = { email, password }; 
    writeUsers([...users, newUser]);

    setSuccess("Ro'yxatdan o'tish muvaffaqiyatli! Endi login qiling.");
    setMode("login");
    setPassword("");
    setConfirm("");
  }

  function handleLogin(e) {
    e.preventDefault();
    resetMessages();

    if (!validateEmail(email)) return setError("Email noto'g'ri formatda");
    const users = readUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return setError("Email yoki parol noto'g'ri");

    localStorage.setItem("auth", JSON.stringify({ email: user.email, time: Date.now() }));
    setSuccess("Tizimga muvaffaqiyatli kirdingiz ✔");
  }

  function logout() {
    localStorage.removeItem("auth");
    setSuccess("Chiqdingiz");
  }

  const isAuthed = (() => {
    try {
      return Boolean(JSON.parse(localStorage.getItem("auth") || "null"));
    } catch {
      return false;
    }
  })();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{mode === "login" ? "Kirish" : "Ro'yxatdan o'tish"}</h1>
          <button
            type="button"
            onClick={() => handleSwitch(mode === "login" ? "register" : "login")}
            className="text-sm text-blue-600 hover:underline"
          >
            {mode === "login" ? "Ro'yxatdan o'tish →" : "Kirishga o'tish →"}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 text-green-700 px-4 py-2 text-sm">{success}</div>
        )}

        {isAuthed ? (
          <div className="space-y-4">
            <p className="text-gray-700">Siz tizimdasiz: <span className="font-semibold">{JSON.parse(localStorage.getItem("auth")).email}</span></p>
            <button onClick={logout} className="w-full h-11 rounded-xl bg-gray-900 text-white font-medium">Chiqish</button>
          </div>
        ) : (
          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 rounded-xl border border-gray-300 px-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute inset-y-0 right-2 my-auto text-sm text-gray-600"
                >
                  {showPwd ? "Yashir" : "Ko'rsat"}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parolni tasdiqlang</label>
                <input
                  type={showPwd ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full h-11 rounded-xl border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••"
                  required
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {mode === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Demoda ma'lumotlar <code>localStorage</code> ga saqlanadi. Real loyihada server va parolni xeshlash kerak.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
