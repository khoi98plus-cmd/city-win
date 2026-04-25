export function simulateWhatIf(base, change) {

  const newTraffic = base.traffic + (change.ads_increase || 0);
  const newConversion = base.conversion_rate + (change.conversion_boost || 0);

  const orders = newTraffic * newConversion;
  const revenue = orders * base.avg_order_value;

  return {
    traffic: newTraffic,
    orders: Math.floor(orders),
    revenue: Math.floor(revenue),
    profit: Math.floor(revenue - base.ads_spend)
  };
}