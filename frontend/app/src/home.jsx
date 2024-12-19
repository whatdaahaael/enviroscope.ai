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
          body {
            font-family: 'Roboto', sans-serif;
            background-color: #1e1e1e;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
          }
          
          .container {
            width: 100%;
            text-align: center;
            align-items:center;
            justify-content:center;
            display:flex;
            flex-direction:column;

          }
          
          .title {
            font-size: 3rem;
            font-weight: 900;
            color: #00ff88;
            margin-bottom: 20px;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
            animation: glow 1.5s ease-in-out infinite alternate;
          }

          @keyframes glow {
            0% { text-shadow: 0 0 10px rgba(0, 255, 136, 0.8), 0 0 20px rgba(0, 255, 136, 0.6); }
            100% { text-shadow: 0 0 30px rgba(0, 255, 136, 1), 0 0 50px rgba(0, 255, 136, 0.8); }
          }

          .features {
            display: flex;
            justify-content: space-evenly;
            align-items:center;
            gap:5vw;
            margin: 20px 0;
          }

          .feature-box {
            background-color: #333;
            border-radius: 12px;
            padding: 20px;
            width: 20vw;
            box-shadow: 0 5px 15px rgba(0, 255, 136, 0.2);
            transition: transform 0.3s ease;
          }

          .feature-box:hover {
            transform: scale(1.1);
          }

          .feature-value {
            font-size: 2rem;
            font-weight: 700;
            color: #ffcc00;
          }

          .feature-label {
            font-size: 1.2rem;
            font-weight: 500;
            color: #cccccc;
          }

          .probability-container {
            margin-top: 40px;
            padding: 10px;
            background-color: #2c3e50;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 255, 136, 0.2);
            width:30vw;
          }

          .probability-bar {
            height: 30px;
            border-radius: 12px;
            color:white;            
          }

          .probability-label {
            
            font-size: 1.2rem;
            font-weight: 600;
            color: #fff;
          }

          .probability-value {
            font-size: 2rem;
            font-weight: 700;
            color: #00ff88;
            margin-top: 10px;
          }
            .buttons-container {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 30px;
    }

    .buttons-container {
      display: flex;
      justify-content: center;
      gap: 15px; /* Reduced the gap */
      margin-top: 30px;
    }

    .button {
      background-color: #2c3e50; /* Dark metallic background */
      color: #ecf0f1; /* Light gray text */
      font-size: 1.1rem;
      font-weight: 500;
      padding: 12px 24px; /* Slightly smaller padding */
      border: 2px solid #3498db; /* Blue border for a techy, modern feel */
      border-radius: 6px; /* Less rounded, more angular edges */
      cursor: pointer;
      box-shadow: 0 3px 10px rgba(52, 152, 219, 0.4); /* Subtle glow */
      transition: all 0.3s ease;
      text-transform: uppercase;
    }

    .button:hover {
      background-color: #34495e; /* Slightly darker metallic background on hover */
      border-color: #2980b9; /* Darker blue border on hover */
      transform: translateY(-2px); /* Lift the button slightly */
      box-shadow: 0 6px 20px rgba(52, 152, 219, 0.6); /* Intense glow on hover */
    }

    .button:focus {
      outline: none;
    }
 

        `}
      </style>

      <div className="container">
        <h1 className="title">LIVE FEED</h1>

        <div className="features">
          {/* Heavy Rains Box */}
          <div className="feature-box">
            <p className="feature-value">{randomFeatures.heavy_rains}</p>
            <p className="feature-label">Heavy Rains</p>
          </div>

          {/* Storms Box */}
          <div className="feature-box">
            <p className="feature-value">{randomFeatures.storms}</p>
            <p className="feature-label">Storms</p>
          </div>
        </div>

        {/* Probability Bar */}
        <div className="probability-container">
          <div
            className="probability-bar"
            style={{ width: `${Math.min(Math.max(predictedProbability, 0), 100)}%` }}
          >
            <p className="probability-label">Predicted Probability</p>
          </div>
          <p className="probability-value">{Math.min(Math.max(predictedProbability, 0), 100).toFixed(2)}%</p>
          </div>
      </div>

      <div className="buttons-container">
  <button className="button">Combinations</button>
  <button className="button">Graph</button>
</div>

    </>
  );
}
