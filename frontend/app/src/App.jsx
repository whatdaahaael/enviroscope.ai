import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './home'
function App() {
  

  return (
    <>
    <Router>
          <Routes>
        <Route path="/" element={<Home />} />
        
      </Routes>
    </Router>

    </>
  )
}

export default App
