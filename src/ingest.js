export function getBusinessData() {

  // giả lập dữ liệu shop
  const traffic = Math.floor(Math.random() * 200);
  const conversion_rate = Math.random() * 0.05;
  const avg_order_value = 100;
  const ads_spend = 50;

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