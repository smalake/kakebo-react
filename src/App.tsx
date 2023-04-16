import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { EventRegister } from "./pages/EventRegister";
import { Calendar } from "./pages/Calendar";
import { Graph } from "./pages/Graph";
import { Setting } from "./pages/Setting";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EventRegister />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="event-register" element={<EventRegister />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="graph" element={<Graph />} />
          <Route path="setting" element={<Setting />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
