// function App() {
import { Contador } from "./components/contador";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/home";

function App() {
  return (
    <>
      <Navbar />
      <Contador />
     <Home />
    </>
  );
}

export default App;
