import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import { EventRegister } from "./pages/EventRegister";
import { Calendar } from "./pages/Calendar";
import { Graph } from "./pages/Graph";
import { Setting } from "./pages/Setting/Setting";
import { RecoilRoot } from "recoil";
import { MenuLayout } from "./components/layout/MenuLayout";
import { EventEdit } from "./pages/EventEdit";
import { NoMenuLayout } from "./components/layout/NoMenuLayout";
import { EventLayout } from "./components/layout/EventLayout";
import { ChangeName } from "./pages/Setting/ChangeName";
import { Select } from "./pages/Setup/Select";
import { Start } from "./pages/Setup/Start";
import { Setup } from "./components/layout/Setup";
import { Create } from "./pages/Setup/Create";
import { CreateOK } from "./pages/Setup/CreateOK";
import { SetupCheck } from "./components/layout/SetupCheck";
import { CookiesProvider } from "react-cookie";
import { Auth0Provider } from "@auth0/auth0-react";
import { Authentication } from "./pages/Auth/Authentication";

function App() {
  const domain: string = process.env.REACT_APP_AUTH0_DOMAIN!;
  const client_id: string = process.env.REACT_APP_AUTH0_CLIENT_ID!;
  const audience: string = process.env.REACT_APP_AUTH0_AUDIENCE!;
  return (
    <Auth0Provider
      domain={domain}
      clientId={client_id}
      authorizationParams={{
        redirect_uri: window.location.origin + "/auth",
        audience: audience,
        scope: "read:current_user update:current_user_metadata",
      }}
    >
      <RecoilRoot>
        <CookiesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Authentication />} />
              <Route index element={<Login />} />
              <Route path="login" element={<Login />} />
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
    </Auth0Provider>
  );
}

export default App;
