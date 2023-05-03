import { Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Start = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "60%" }}>
      <Box component="span" sx={{ fontSize: "18px", marginBottom: "50px", textAlign: "center" }}>
        初期設定を行います
      </Box>
      <Button
        variant="contained"
        onClick={() => {
          navigate("/setup-select");
        }}
        sx={{ height: "45px", fontSize: "16px", fontWeight: "bold" }}
      >
        次へ
      </Button>
    </Box>
  );
};
