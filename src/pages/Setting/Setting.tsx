import React from "react";
import styles from "./Setting.module.css";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { auth } from "../../firebase";

export const Setting = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["kakebo"]);
  const logout = async () => {
    const res = window.confirm("ログアウトしてもよろしいですか？");
    if (res) {
      try {
        await auth.signOut();
        removeCookie("kakebo");
        alert("ログアウトしました");
        navigate("/login");
      } catch (err) {
        alert("ログアウトできませんでした");
      }
    }
  };
  return (
    <div className={styles.container}>
      <h2>設定</h2>
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          sx={{ fontSize: "18px", width: "80%", marginBottom: "30px" }}
          onClick={() => {
            navigate("/change-name");
          }}
        >
          表示名の変更
        </Button>
        <Button variant="contained" sx={{ fontSize: "18px", width: "80%" }} onClick={logout}>
          ログアウト
        </Button>
      </Box>
    </div>
  );
};
