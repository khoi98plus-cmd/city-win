export function simulateBusiness(data) {

  // giả lập thay đổi nhẹ theo thời gian
  const traffic = data.traffic + Math.floor(Math.random() * 20 - 10);
  const conversion_rate = data.conversion_rate + (Math.random() * 0.01 - 0.005);

  const avg_order_value = data.avg_order_value;
  const ads_spend = data.ads_spend;

  const orders = Math.max(0, Math.floor(traffic * conversion_rate));
  const revenue = orders * avg_order_value;
  const profit = revenue - ads_spend;

  return {
    traffic: Math.max(0, traffic),
    conversion_rate: Math.max(0, conversion_rate),
    avg_order_value,
    ads_spend,
    orders,
    revenue,
    profit
  };
}