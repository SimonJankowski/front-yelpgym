import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./screens/LandingPage";
import Gyms from "./screens/Gyms";
import Show from "./screens/Show";
import New from "./screens/New";
import Edit from "./screens/Edit";
import ErrorScreen from "./screens/ErrorScreen";
import Boilerplate from "./partials/Boilerplate";
import Register from "./screens/Register";
import Login from "./screens/Login";
import PRoute from "./partials/ProtectedRoute";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [checkInProgress, setCheckInProgress] = useState(true);
  useEffect(() => {
    setCheckInProgress(true);
    axios.get("/get-user").then((res) => {
      setCurrentUser(res.data);
      setCheckInProgress(false);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<LandingPage setUser={setCurrentUser} user={currentUser} />} />
        <Route element={<Boilerplate user={currentUser} setUser={setCurrentUser} />}>
          <Route path="/gyms" element={<Gyms />} />
          <Route path="/gym/:gymid" element={<Show user={currentUser} />} />
          <Route
            path="/gym/:gymid/edit"
            element={
              <PRoute user={currentUser} checkInProgress={checkInProgress}>
                <Edit user={currentUser} checkInProgress={checkInProgress} />
              </PRoute>
            }
          />
          <Route
            path="/new"
            element={
              <PRoute user={currentUser} checkInProgress={checkInProgress}>
                <New />
              </PRoute>
            }
          />
          <Route path="/error" element={<ErrorScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<ErrorScreen title="Page not found" />} />
          {/* <Route path="*" element={<Navigate to="/error" replace />} /> */}
          <Route element={<ErrorScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
