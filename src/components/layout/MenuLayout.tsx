import { Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { FooterMenu } from "../FooterMenu";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { loginAtom } from "../../recoil/LoginAtom";

export const MenuLayout = () => {
  const navigate = useNavigate();
  const isLogin = useRecoilValue(loginAtom);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const loginCheck = () => {
      try {
        if (localStorage.getItem("token")) {
          if (isLogin === 0) {
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        setErr(true);
      }
    };
    loginCheck();
  }, [navigate, isLogin]);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        {err ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "200px",
              alignItems: "center",
              height: "100%",
            }}
          >
            エラーが発生しました
          </Box>
        ) : (
          <Outlet />
        )}
      </Box>
      <Box sx={{ width: "max-content" }}>
        <FooterMenu />
      </Box>
    </Box>
  );
};
