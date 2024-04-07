import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Map from "./pages/Map"
import Live from "./pages/Live"
import Table from "./pages/Table"



function App() {

  return (
    <>
    <div>
      <BrowserRouter>
      <Routes>
        <Route index element={<Home />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/map" element={<Map />}/>
        <Route path="/live" element={<Live />}/>
        <Route path="/table" element={<Table />}/>
      </Routes>
      </BrowserRouter>
    </div>
    </>
  
  )
}

export default App;
