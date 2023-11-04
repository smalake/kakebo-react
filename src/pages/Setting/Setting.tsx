import React, { useEffect, useState } from "react";
import styles from "./Setting.module.css";
import { Box, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { settingApi } from "../../api/settingApi";
import { db } from "../../db/db";

export const Setting = () => {
  const navigate = useNavigate();
  const [isParent, setIsParent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // グループの親かどうかチェック
    const checkParent = async () => {
      try {
        const res = await settingApi.isParent();
        if (res.status === 200) {
          setIsParent(res.data.parent);
        } else if (res.status === 401) {
          alert("ログインしてください");
          navigate("/login");
        } else {
          alert("エラーが発生しました");
          console.log(res);
        }
      } catch (err) {
        alert("エラーが発生しました");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    checkParent();
  }, [navigate]);

  const clickLogout = async () => {
    const res = window.confirm("ログアウトしてもよろしいですか？");
    if (res) {
      try {
        const res = await authApi.logout();
        if (res.status === 200) {
          localStorage.removeItem("token");
          // localStorage.removeItem("refresh");
          await db.delete();
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
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            // marginTop: "330px",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <div>
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
            <Button
              variant="contained"
              sx={{ fontSize: "18px", width: "80%", marginBottom: "30px" }}
              onClick={() => {
                navigate("/pattern-setting");
              }}
            >
              お気に入りの登録・編集
            </Button>
            {isParent && (
              <Button
                variant="contained"
                sx={{
                  fontSize: "18px",
                  width: "80%",
                  marginBottom: "30px",
                }}
                onClick={() => {
                  navigate("/invite-group");
                }}
              >
                共有家計簿への招待
              </Button>
            )}
            <Button
              variant="contained"
              sx={{ fontSize: "18px", width: "80%", marginBottom: "30px" }}
              onClick={() => {
                navigate("/contact");
              }}
            >
              お問い合わせ
            </Button>
            <Button variant="contained" sx={{ fontSize: "18px", width: "80%" }} onClick={clickLogout}>
              ログアウト
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
};
