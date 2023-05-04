import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

export const Setup = () => {
  return (
    <Box sx={{ background: "#fff", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <Outlet />
    </Box>
  );
};
