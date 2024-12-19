import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

export default function SurfacePlot() {
  const [D, setD] = useState(null);

  // Fetch data from your API
  useEffect(() => {
    async function getOptimizedTheta() {
      try {
        const resp = await axios.get("http://localhost:3111/api/trainModel");
        setD(resp.data.habitable_combinations);
      } catch (error) {
        console.log(error);
      }
    }

    getOptimizedTheta();
  }, []);

  // Prepare the data for Plotly once it is loaded
  const prepareData = () => {
    if (!D) return null;

    const x = D.map(item => item.heavy_rains_combined);
    const y = D.map(item => item.storms_combined);
    const z = D.map(item => item.probability_combined);

    return {
      type: 'scatter3d',
      mode: 'markers',
      x: x,
      y: y,
      z: z,
      marker: {
        color: z, // Color points based on probability_combined
        colorscale: 'Viridis',
        size: 4,
      },
    };
  };

  return (
    <div style={{ height: 'auto' }}>
      <Plot
        data={[prepareData()]}
        layout={{
          title: '3D Surface Plot',
          scene: {
            xaxis: { title: 'Heavy Rains Combined' },
            yaxis: { title: 'Storms Combined' },
            zaxis: { title: 'Probability Combined' },
          },
        }}
      />
    </div>
  );
}
