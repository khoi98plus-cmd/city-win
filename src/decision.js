export function makeDecision(prediction) {
  if (!prediction) return null;

  const actions = [];

  if (prediction.traffic > 0.7) {
    actions.push("🚦 Increase traffic control");
  }

  if (prediction.energy > 0.7) {
    actions.push("⚡ Optimize energy usage");
  }

  if (prediction.population > 0.8) {
    actions.push("🏙 Expand infrastructure");
  }

  return actions;
}