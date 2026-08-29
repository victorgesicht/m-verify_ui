import Navbar from './components/Navbar'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'


function App() {
  

  return (
    <div className="App">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} /> 
    </Routes>     
    </div>
  )
}

export default App
