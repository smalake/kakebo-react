import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { FooterMenu } from "../FooterMenu";

export const MenuLayout = () => {
  return (
    <Box sx={{ display: "flex", width: "100%", position: "absolute", top: "0" }}>
      <Box sx={{ flexGrow: 1, width: "max-content" }}>
        <Outlet />
      </Box>
      <Box sx={{ width: "max-content" }}>
        <FooterMenu />
      </Box>
    </Box>
  );
};
