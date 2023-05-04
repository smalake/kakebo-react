import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FooterMenu } from "../FooterMenu";
import { useRecoilState } from "recoil";
import { checkAtom } from "../../recoil/CheckAtom";
import { setupApi } from "../../api/setupApi";

export const MenuLayout = () => {
  const navigate = useNavigate();
  const [check, setCheck] = useRecoilState(checkAtom);

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
