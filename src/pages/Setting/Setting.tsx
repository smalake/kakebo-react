import React from "react";
import styles from "./Setting.module.css";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";

export const Setting = () => {
  const navigate = useNavigate();
  const clickLogout = async () => {
    const res = window.confirm("ログアウトしてもよろしいですか？");
    if (res) {
      try {
        const res = await authApi.logout();
        if (res.status === 200) {
          alert("ログアウトしました");
          navigate("/login");
        } else {
          console.log(res);
          alert("ログアウトに失敗しました");
        }
      } catch (err) {
        console.log(err);
        alert("ログアウトに失敗しました");
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
