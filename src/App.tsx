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
import { ChangeName } from "./pages/Setting/ChangeName";
import { CookiesProvider } from "react-cookie";
import { Auth0Provider } from "@auth0/auth0-react";
import { Top } from "./pages/Top";
import { Join } from "./pages/Auth/Join";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

function App() {
  const domain: string = process.env.REACT_APP_AUTH0_DOMAIN!;
  const client_id: string = process.env.REACT_APP_AUTH0_CLIENT_ID!;
  const audience: string = process.env.REACT_APP_AUTH0_AUDIENCE!;
  return (
    <Auth0Provider
      domain={domain}
      clientId={client_id}
      authorizationParams={{
        redirect_uri: window.location.origin + "/login",
        audience: audience,
        scope: "read:current_user update:current_user_metadata",
      }}
    >
      <RecoilRoot>
        <Suspense fallback={<Fallback />}>
          <CookiesProvider>
            <BrowserRouter>
              <Routes>
                <Route index element={<Top />} />
                <Route path="login" element={<Login />} />
                <Route path="join" element={<Join />} />
                <Route path="/" element={<NoMenuLayout />}>
                  <Route path="event-edit/:id" element={<EventEdit />} />
                  <Route path="change-name" element={<ChangeName />} />
                </Route>
                <Route path="/" element={<MenuLayout />}>
                  <Route path="event-register" element={<EventRegister />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="graph" element={<Graph />} />
                  <Route path="setting" element={<Setting />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CookiesProvider>
        </Suspense>
      </RecoilRoot>
    </Auth0Provider>
  );
}

export default App;

// 値取得中のローディング処理
const Fallback = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "330px",
      }}
    >
      <CircularProgress />
    </Box>
  );
};
