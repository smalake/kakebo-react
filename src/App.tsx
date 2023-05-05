import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { EventRegister } from "./pages/EventRegister";
import { Calendar } from "./pages/Calendar";
import { Graph } from "./pages/Graph";
import { Setting } from "./pages/Setting/Setting";
import { RecoilRoot } from "recoil";
import { MenuLayout } from "./components/layout/MenuLayout";
import { EventEdit } from "./pages/EventEdit";
import { NoMenuLayout } from "./components/layout/NoMenuLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import { EventLayout } from "./components/layout/EventLayout";
import { ChangeName } from "./pages/Setting/ChangeName";
import { Select } from "./pages/Setup/Select";
import { Start } from "./pages/Setup/Start";
import { Setup } from "./components/layout/Setup";
import { Create } from "./pages/Setup/Create";
import { CreateOK } from "./pages/Setup/CreateOK";
import { SetupCheck } from "./components/layout/SetupCheck";
import { CookiesProvider } from "react-cookie";

function App() {
  return (
    <RecoilRoot>
      <CookiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route path="/" element={<SetupCheck />}>
              <Route path="/" element={<NoMenuLayout />}>
                <Route path="event-edit/:id" element={<EventEdit />} />
                <Route path="change-name" element={<ChangeName />} />
              </Route>
              <Route path="/" element={<MenuLayout />}>
                <Route path="event-register" element={<EventRegister />} />
                <Route path="/" element={<EventLayout />}>
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="graph" element={<Graph />} />
                </Route>
                <Route path="setting" element={<Setting />} />
              </Route>
            </Route>
            <Route path="/" element={<Setup />}>
              <Route path="setup" element={<Start />} />
              <Route path="setup-select" element={<Select />} />
              <Route path="setup-create" element={<Create />} />
              <Route path="setup-complete" element={<CreateOK />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </RecoilRoot>
  );
}

export default App;
