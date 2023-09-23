import { Box, CircularProgress } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { FooterMenu } from "../FooterMenu";
import { useEffect, useState } from "react";
import { authApi } from "../../api/authApi";

export const MenuLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginCheck = async () => {
      try {
        if (localStorage.getItem("token")) {
          const res = await authApi.isLogin();
          if (res.status === 401) {
            alert("ログインしてください");
            navigate("/login");
          } else if (res.status === 200) {
            // 何もしない
          } else {
            alert("エラーが発生しました");
            console.log(res);
          }
        } else {
          alert("ログインしてください");
          navigate("/login");
        }
      } catch (err) {
        alert("エラーが発生しました");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loginCheck();
  }, [navigate]);
  return (
    <Box sx={{ display: "flex", width: "100%", position: "absolute", top: "0" }}>
      <Box sx={{ flexGrow: 1, width: "max-content" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "200px",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
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
