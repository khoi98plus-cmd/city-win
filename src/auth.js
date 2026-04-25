import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const path = "./data/users.json";
const SECRET = "mysecretkey";

// đọc user
function getUsers() {
  if (!fs.existsSync(path)) return [];
  return JSON.parse(fs.readFileSync(path));
}

// lưu user
function saveUsers(users) {
  fs.writeFileSync(path, JSON.stringify(users, null, 2));
}

// REGISTER
export async function register(username, password) {
  const users = getUsers();

  if (users.find(u => u.username === username)) {
    throw new Error("User đã tồn tại");
  }

  const hashed = await bcrypt.hash(password, 10);

  users.push({ username, password: hashed });

  saveUsers(users);

  return "OK";
}

// LOGIN
export async function login(username, password) {
  const users = getUsers();

  const user = users.find(u => u.username === username);

  if (!user) throw new Error("Sai tài khoản");

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw new Error("Sai mật khẩu");

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

  return token;
}

// VERIFY
export function verifyToken(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) return res.status(401).send("No token");

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}