import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [optimizedTheta, setOptimizedTheta] = useState([0, 0, 0]); // Store optimized theta values
  const [randomFeatures, setRandomFeatures] = useState({ heavy_rains: 0, storms: 0 });
  const [predictedProbability, setPredictedProbability] = useState(0);

  // Fetch optimized coefficients from the backend
  async function getOptimizedTheta() {
    try {
      const resp = await axios.get("http://localhost:3111/api/trainModel");
      setOptimizedTheta(resp.data.optimized_theta);
    } catch (error) {
      console.log(error);
    }
  }

  // Generate random feature values for heavy rains and storms
  function generateRandomFeatures() {
    const heavyRains = Math.floor(Math.random() * 20); // Random value between 0 and 20
    const storms = Math.floor(Math.random() * 20); // Random value between 0 and 20
    setRandomFeatures({ heavy_rains: heavyRains, storms: storms });
  }

  // Calculate predicted probability using the optimized theta
  function calculatePrediction() {
    const { heavy_rains, storms } = randomFeatures;
    const [theta0, theta1, theta2] = optimizedTheta;
    const prediction = theta0 + theta1 * heavy_rains + theta2 * storms;
    setPredictedProbability(prediction);
  }

  // Set up interval to update random features and calculate predictions every 2 minutes
  useEffect(() => {
    getOptimizedTheta();
    const interval = setInterval(() => {
      generateRandomFeatures();
    }, 1200); // Update every 2 minutes (120,000 ms)

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  // Recalculate the prediction whenever the random features or optimized theta change
  useEffect(() => {
    if (optimizedTheta[0] !== 0) {
      calculatePrediction();
    }
  }, [randomFeatures, optimizedTheta]);

  return (
    <>
    <style>
        
        {`
        .features{
        display:flex;
        align-items:center;
        justify-content:space-evenly;
        }
        `}
  </style>
  <div className="container">
    <center>
  <h1 className="title">LIVE FEED</h1>
  </center>
  <div className="features">
    {/* Heavy Rains Box */}
    <div className="feature-box">
      <p className="feature-label">Heavy Rains</p>
      <p className="feature-value">{randomFeatures.heavy_rains}</p>
    </div>
    
    {/* Storms Box */}
    <div className="feature-box">
      <p className="feature-label">Storms</p>
      <p className="feature-value">{randomFeatures.storms}</p>
    </div>
  </div>
  
  {/* Probability Bar */}
  <div className="probability-container">
    <div
      className="probability-bar"
      style={{ width: `${Math.min(Math.max(predictedProbability, 0), 100)}%` }}
    >
      <p className="probability-label">Predicted Probability</p>
      <p className="probability-value">{predictedProbability.toFixed(2)}%</p>
    </div>
  </div>
</div>

</>
  );
}
