export function businessAdvice(state) {

  const advice = [];

  if (state.conversion_rate < 0.02) {
    advice.push("Cải thiện landing page");
  }

  if (state.traffic < 100) {
    advice.push("Nên chạy quảng cáo");
  }

  if (state.profit < 0) {
    advice.push("Giảm chi phí ads hoặc tăng giá");
  }

  return advice;
}