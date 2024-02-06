import Navbar from './Navbar';
import Home from "./pages/Home"
import Map from "./pages/Map"
import Table from "./pages/Table"


function App() {
  let component
  switch (window.location.pathname) {
    case "/":
      component = <Home />
      break
    case "/map":
      component = <Map />
      break
    case "/table":
      component = <Table />
      break
  }

  return (
    <>
    <Navbar />
    {component}
    </>
  
  )
}

export default App;
