export function predictNext(history) {
  if (history.length < 5) return null;

  const last = history.slice(-5);

  const avgTraffic =
    last.reduce((sum, h) => sum + h.traffic, 0) / last.length;

  const avgEnergy =
    last.reduce((sum, h) => sum + h.energy, 0) / last.length;

  const avgPopulation =
    last.reduce((sum, h) => sum + h.population, 0) / last.length;

  return {
    traffic: avgTraffic,
    energy: avgEnergy,
    population: avgPopulation
  };
}