export function businessAdvice(state) {

  const advice = [];

  if (state.conversion_rate < 0.02) {
    advice.push("Cải thiện landing page hoặc nội dung");
  }

  if (state.traffic < 100) {
    advice.push("Nên chạy quảng cáo để tăng traffic");
  }

  if (state.profit < 0) {
    advice.push("Giảm ads hoặc tăng giá sản phẩm");
  }

  return advice;
}