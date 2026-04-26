import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";

import { getUserData, saveUserData } from "./src/storage.js";
import { simulateBusiness } from "./src/simulate.js";
import { detectBusinessRisk } from "./src/detect.js";
import { businessAdvice } from "./src/advisor.js";
import { simulateWhatIf } from "./src/whatif.js";

import { register, login, verifyToken } from "./src/auth.js";

const app = express();

/* =========================
   🔧 FIX PATH (QUAN TRỌNG)
========================= */

// luôn lấy đúng root project trên Render
const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");

// tự tạo thư mục + file nếu thiếu
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, "users.json");
const HISTORY_FILE = path.join(DATA_DIR, "history.json");
const CITY_FILE = path.join(DATA_DIR, "city.json");

if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");
if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, "[]");
if (!fs.existsSync(CITY_FILE)) fs.writeFileSync(CITY_FILE, "{}");

/* =========================
   🔧 MIDDLEWARE PRO
========================= */

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60
});
app.use("/api", limiter);

/* =========================
   🔐 AUTH
========================= */

app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: "Thiếu dữ liệu" });

    await register(username, password);

    res.json({ message: "Đăng ký thành công" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: "Thiếu dữ liệu" });

    const token = await login(username, password);

    res.json({ token });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =========================
   🤖 AI CHAT
========================= */

app.post("/api/ai", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message)
      return res.status(400).json({ reply: "Thiếu câu hỏi" });

    const username = req.user.username;
    const data = getUserData(username);
    const state = simulateBusiness(data);

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ reply: "❌ Chưa cấu hình GEMINI_API_KEY" });
    }

    const controller = new AbortController();
    setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const result = await response.json();

    const reply =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI không trả lời được";

    res.json({ reply });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ reply: "❌ Lỗi AI server" });
  }
});

/* =========================
   📊 BUSINESS API
========================= */

app.get("/api/business", verifyToken, async (req, res) => {
  try {
    const username = req.user.username;

    let data = getUserData(username);

    const state = simulateBusiness(data);
    const alert = detectBusinessRisk(state);
    const advice = await businessAdvice(state);

    const scenario = simulateWhatIf(state, {
      ads_increase: 50,
      conversion_boost: 0.01
    });

    saveUserData(username, state);

    res.json({
      user: username,
      state,
      alert,
      advice,
      scenario
    });

  } catch (err) {
    console.error("BUSINESS ERROR:", err);
    res.status(500).json({ error: "Server lỗi" });
  }
});

/* =========================
   🧪 HEALTH
========================= */

app.get("/", (req, res) => {
  res.send("🚀 AI Business Simulator đang chạy...");
});

/* =========================
   ▶️ START
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Server chạy tại port ${PORT}`);
});