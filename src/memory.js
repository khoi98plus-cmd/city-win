import fs from "fs";

const path = "./data/history.json";

export function saveState(state) {
  let history = [];

  // nếu file chưa tồn tại → tạo mới
  if (fs.existsSync(path)) {
    history = JSON.parse(fs.readFileSync(path, "utf-8"));
  }

  history.push(state);

  // giữ tối đa 50 bản ghi
  if (history.length > 50) history.shift();

  fs.writeFileSync(path, JSON.stringify(history, null, 2));
}

export function getHistory() {
  if (!fs.existsSync(path)) return [];
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}