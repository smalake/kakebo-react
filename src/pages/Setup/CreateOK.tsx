import { Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export const CreateOK = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "90%", alignItems: "center" }}>
      <Box component="h2" sx={{ position: "relative", bottom: "50px" }}>
        家計簿を新規作成しました
      </Box>
      <Button
        variant="contained"
        onClick={() => {
          navigate("/event-register");
        }}
        sx={{ width: "70%", height: "45px", fontSize: "16px", fontWeight: "bold" }}
      >
        家計簿を使い始める
      </Button>
    </Box>
  );
};
