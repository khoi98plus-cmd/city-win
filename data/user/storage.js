import fs from "fs";

export function getUserData(username) {
  const path = `./data/users/${username}.json`;

  if (!fs.existsSync(path)) {
    // tạo data mặc định
    const defaultData = {
      traffic: 100,
      conversion_rate: 0.02,
      avg_order_value: 100,
      ads_spend: 50
    };

    fs.writeFileSync(path, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }

  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

export function saveUserData(username, data) {
  const path = `./data/users/${username}.json`;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}