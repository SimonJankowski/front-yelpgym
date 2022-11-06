import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./screens/LandingPage";
import Gyms from "./screens/Gyms";
import Show from "./screens/Show";
import New from "./screens/New";
import Edit from "./screens/Edit";
import Boilerplate from "./partials/Boilerplate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<LandingPage />} />
        <Route element={<Boilerplate />}>
          <Route path="/gyms" element={<Gyms />} />
          <Route path="/gym/:gymid" element={<Show />} />
          <Route path="/gym/:gymid/edit" element={<Edit />} />
          <Route path="/new" element={<New />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
