import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './home'
function App() {
  const [count, setCount] = useState(0)

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
