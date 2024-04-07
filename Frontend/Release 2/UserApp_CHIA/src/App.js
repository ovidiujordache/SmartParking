import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Map from "./pages/Map"


function App() {

  return (
    <>
    <div>
      <BrowserRouter>
      <Routes>
        <Route index element={<Home />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/map" element={<Map />}/>
      </Routes>
      </BrowserRouter>
    </div>
    </>
  
  )
}

export default App;
