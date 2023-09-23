import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import { EventRegister } from "./pages/Event/EventRegister";
import { Calendar } from "./pages/Event/Calendar";
import { Graph } from "./pages/Event/Graph";
import { Setting } from "./pages/Setting/Setting";
import { RecoilRoot } from "recoil";
import { MenuLayout } from "./components/layout/MenuLayout";
import { EventEdit } from "./pages/Event/EventEdit";
import { NoMenuLayout } from "./components/layout/NoMenuLayout";
import { ChangeName } from "./pages/Setting/ChangeName";
import { Join } from "./pages/Auth/Join";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Register } from "./pages/Auth/Register";
import { InviteGroup } from "./pages/Setting/InviteGroup";
import { CalendarPrivate } from "./pages/Private/Calendar";
import { EventPrivateEdit } from "./pages/Private/EventEdit";
import { GraphPrivate } from "./pages/Private/Graph";

function App() {
  return (
    <RecoilRoot>
      <Suspense fallback={<Fallback />}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="join/:group" element={<Join />} />
            <Route path="/" element={<NoMenuLayout />}>
              <Route path="event-edit/:id" element={<EventEdit />} />
              <Route path="event-private-edit/:id" element={<EventPrivateEdit />} />
              <Route path="change-name" element={<ChangeName />} />
              <Route path="invite-group" element={<InviteGroup />} />
            </Route>
            <Route path="/" element={<MenuLayout />}>
              <Route path="event-register" element={<EventRegister />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="calendar-private" element={<CalendarPrivate />} />
              <Route path="graph" element={<Graph />} />
              <Route path="graph-private" element={<GraphPrivate />} />
              <Route path="setting" element={<Setting />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </RecoilRoot>
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
