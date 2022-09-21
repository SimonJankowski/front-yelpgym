import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./screens/LandingPage";
import Gyms from "./screens/Gyms";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gyms" element={<Gyms />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
