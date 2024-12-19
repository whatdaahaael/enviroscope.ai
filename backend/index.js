const express = require("express");

const app = express();
const PORT = process.env.PORT || 3111;

const data = [
  { heavy_rains: 8, storms: 9, probability: 90 },
  { heavy_rains: 7, storms: 4, probability: 75 },
  { heavy_rains: 6, storms: 2, probability: 65 },
  { heavy_rains: 3, storms: 10, probability: 80 },
  { heavy_rains: 1, storms: 2, probability: 30 },
  { heavy_rains: 9, storms: 8, probability: 95 },
  { heavy_rains: 4, storms: 6, probability: 60 },
  { heavy_rains: 7, storms: 5, probability: 70 },
  { heavy_rains: 2, storms: 3, probability: 50 },
  { heavy_rains: 10, storms: 10, probability: 100 },
];

const learningRate = 0.01; // Learning rate for gradient descent
const iterations = 1000; // Number of iterations for gradient descent

// Hypothesis function h(X, θ)
function hypothesis(x, theta) {
  return theta[0] + theta[1] * x[0] + theta[2] * x[1]; // θ0 + θ1*heavy_rains + θ2*storms
}

// Cost function J(θ)
function costFunction(data, theta) {
  let m = data.length;
  let sum = 0;
  for (let i = 0; i < m; i++) {
    let x = [data[i].heavy_rains, data[i].storms];
    let y = data[i].probability;
    let h = hypothesis(x, theta);
    sum += Math.pow(h - y, 2);
  }
  return sum / (2 * m);
}

// Gradient descent function
function gradientDescent(data, theta, alpha, iterations) {
  let m = data.length;
  for (let i = 0; i < iterations; i++) {
    let gradients = [0, 0, 0]; // Gradients for θ0, θ1, and θ2
    for (let j = 0; j < m; j++) {
      let x = [data[j].heavy_rains, data[j].storms];
      let y = data[j].probability;
      let h = hypothesis(x, theta);
      gradients[0] += h - y;
      gradients[1] += (h - y) * x[0];
      gradients[2] += (h - y) * x[1];
    }

    // Update theta values
    theta[0] -= (alpha * gradients[0]) / m;
    theta[1] -= (alpha * gradients[1]) / m;
    theta[2] -= (alpha * gradients[2]) / m;

    // Optional: log the cost function for every 100 iterations
    if (i % 100 === 0) {
      console.log(`Iteration ${i}, Cost: ${costFunction(data, theta)}`);
    }
  }
  return theta;
}

// Generate all possible combinations of heavy_rains and storms
function generateCombinations(data) {
  const combinations = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (i !== j) {
        combinations.push({
          heavy_rains_combined: data[i].heavy_rains + data[j].heavy_rains,
          storms_combined: data[i].storms + data[j].storms,
          probability_combined: (data[i].probability + data[j].probability) / 2, // Averaging probabilities
        });
      }
    }
  }
  return combinations;
}

// Filter combinations to find "habitable" ones based on a threshold probability
function filterHabitableCombinations(combinations, threshold = 60) {
  return combinations.filter((comb) => comb.probability_combined >= threshold);
}

// API endpoint to perform linear regression and generate habitable combinations
app.get("/api/trainModel", (req, res) => {
  let theta = [0, 0, 0]; // Initial values for θ0, θ1, θ2
  theta = gradientDescent(data, theta, learningRate, iterations);

  // Generate combinations and filter for habitable ones
  const combinations = generateCombinations(data);
  const habitableCombinations = filterHabitableCombinations(combinations);

  res.json({
    message: "Model trained successfully!",
    optimized_theta: theta,
    final_cost: costFunction(data, theta),
    habitable_combinations: habitableCombinations,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
