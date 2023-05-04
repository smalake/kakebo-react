import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { setupApi } from "../../api/setupApi";
import { useRecoilState } from "recoil";
import { checkAtom } from "../../recoil/CheckAtom";

export const NoMenuLayout = () => {
  return (
    <Box sx={{ display: "flex", width: "100%", position: "absolute", top: "0" }}>
      <Box sx={{ flexGrow: 1, width: "max-content" }}>
        <Outlet />
      </Box>
    </Box>
  );
};
