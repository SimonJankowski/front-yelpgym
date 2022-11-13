import "./App.css";
import { BrowserRouter, Routes, Route, Switch, Navigate } from "react-router-dom";
import LandingPage from "./screens/LandingPage";
import Gyms from "./screens/Gyms";
import Show from "./screens/Show";
import New from "./screens/New";
import Edit from "./screens/Edit";
import ErrorScreen from "./screens/ErrorScreen";
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
          <Route path="/error" element={<ErrorScreen />} />
          <Route path="*" element={<ErrorScreen title="Page not found" />} />
          {/* <Route path="*" element={<Navigate to="/error" replace />} /> */}
          <Route element={<ErrorScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
