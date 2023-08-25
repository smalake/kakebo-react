import React from "react";
import styles from "./Setting.module.css";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const Setting = () => {
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const clickLogout = async () => {
    const res = window.confirm("ログアウトしてもよろしいですか？");
    if (res) {
      try {
        alert("ログアウトしました");
        logout({ logoutParams: { returnTo: window.location.origin } });
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
        <Button variant="contained" sx={{ fontSize: "18px", width: "80%" }} onClick={clickLogout}>
          ログアウト
        </Button>
      </Box>
    </div>
  );
};
