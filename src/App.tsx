import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { EventRegister } from "./pages/EventRegister";
import { Calendar } from "./pages/Calendar";
import { Graph } from "./pages/Graph";
import { Setting } from "./pages/Setting";
import { RecoilRoot } from "recoil";
import { MenuLayout } from "./components/layout/MenuLayout";
import { EventEdit } from "./pages/EventEdit";
import { NoMenuLayout } from "./components/layout/NoMenuLayout";
import { AuthLayout } from "./components/layout/AuthLayout";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/" element={<NoMenuLayout />}>
            <Route path="event-edit/:id" element={<EventEdit />} />
          </Route>
          <Route path="/" element={<MenuLayout />}>
            <Route path="event-register" element={<EventRegister />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="graph" element={<Graph />} />
            <Route path="setting" element={<Setting />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
