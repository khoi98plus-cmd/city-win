import express from "express";
import cors from "cors";

import { getUserData, saveUserData } from "./src/storage.js";
import { simulateBusiness } from "./src/simulate.js";
import { detectBusinessRisk } from "./src/detect.js";
import { businessAdvice } from "./src/advisor.js";
import { simulateWhatIf } from "./src/whatif.js";

import { register, login, verifyToken } from "./src/auth.js";

const app = express();

/* =========================
   🔧 MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* =========================
   🔐 AUTH
========================= */

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    await register(username, password);

    res.json({ message: "Đăng ký thành công" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const token = await login(username, password);

    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =========================
   📊 BUSINESS API (THEO USER)
========================= */

app.get("/api/business", verifyToken, (req, res) => {
  try {
    const username = req.user.username;

    // 🔥 LẤY DATA RIÊNG USER
    let data = getUserData(username);

    // 🔄 SIMULATE
    const state = simulateBusiness(data);

    // 🚨 DETECT
    const alert = detectBusinessRisk(state);

    // 🤖 ADVICE
    const advice = businessAdvice(state);

    // 🔮 WHAT-IF
    const scenario = simulateWhatIf(state, {
      ads_increase: 50,
      conversion_boost: 0.01
    });

    // 💾 LƯU LẠI
    saveUserData(username, state);

    res.json({
      user: username,
      state,
      alert,
      advice,
      scenario
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server lỗi" });
  }
});

/* =========================
   🧪 TEST
========================= */

app.get("/", (req, res) => {
  res.send("🚀 AI Business Simulator đang chạy...");
});

/* =========================
   ▶️ START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Server chạy tại http://localhost:${PORT}`);
});