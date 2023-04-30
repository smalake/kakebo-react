import React from "react";
import styles from "./Setting.module.css";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Setting = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h2>設定</h2>
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          sx={{ fontSize: "18px", width: "80%" }}
          onClick={() => {
            navigate("/change-name");
          }}
        >
          表示名の変更
        </Button>
      </Box>
    </div>
  );
};
