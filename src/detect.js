export function detectBusinessRisk(state) {

  if (state.profit < 0) {
    return "🚨 Bạn đang lỗ!";
  }

  if (state.conversion_rate < 0.02) {
    return "⚠️ Tỷ lệ chuyển đổi thấp";
  }

  if (state.traffic > 200 && state.orders < 5) {
    return "❗ Có traffic nhưng không ra đơn";
  }

  return "✅ Hoạt động ổn định";
}