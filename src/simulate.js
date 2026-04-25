export function simulateBusiness(data) {

  // giả lập biến động
  const traffic = Math.max(0, data.traffic + Math.floor(Math.random() * 20 - 10));
  const conversion_rate = Math.max(0, data.conversion_rate + (Math.random() * 0.01 - 0.005));

  const avg_order_value = data.avg_order_value;
  const ads_spend = data.ads_spend;

  // tính toán
  const orders = Math.floor(traffic * conversion_rate);
  const revenue = orders * avg_order_value;
  const profit = revenue - ads_spend;

  return {
    traffic,
    conversion_rate,
    avg_order_value,
    ads_spend,
    orders,
    revenue,
    profit
  };
}