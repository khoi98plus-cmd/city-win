import { getCityData } from "./ingest.js";
import { buildModel } from "./model.js";
import { simulate } from "./simulate.js";
import { analyze } from "./analyze.js";
import { optimize } from "./optimize.js";
import { saveState } from "./memory.js";
import { getHistory } from "./memory.js";
import { detectAnomaly } from "./detect.js";

export async function runCityTwin() {

  while (true) {

    try {

      // 🌆 1. Lấy dữ liệu
      const data = getCityData();

      // 🧠 2. Build model (AI)
      const model = await buildModel(data);

      // 🚦 3. Simulation
      const simulation = simulate(model);

      // 💾 4. Lưu lịch sử
      saveState(simulation);

      // 📊 5. Analyze (AI)
      const analysis = await analyze(simulation);

      // 🧬 6. Optimize (AI)
      const policy = await optimize(analysis);

      // 🚨 7. Detect anomaly
      const history = getHistory();
      const alert = detectAnomaly(simulation, history);

      // 🖥️ LOG
      console.log("📊 SIMULATION:", simulation);
      console.log("🧠 ANALYSIS:", analysis);
      console.log("⚙️ POLICY:", policy);

      if (alert) {
        console.log(alert);
      }

    } catch (err) {
      console.error("❌ ERROR:", err.message);
    }

    // ⏳ delay 3 giây
    await new Promise(r => setTimeout(r, 3000));
  }
}