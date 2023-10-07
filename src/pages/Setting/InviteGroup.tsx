import React, { useState } from "react";
import styles from "./Setting.module.css";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { settingApi } from "../../api/settingApi";
import LoadingButton from "@mui/lab/LoadingButton";

export const InviteGroup = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [textboxes, setTextboxes] = useState<any[]>([]);
  const [showButton, setShowButton] = useState(true);
  const [copyMessage, setCopyMessage] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const getURL = async () => {
    setButtonLoading(true);
    try {
      const res = await settingApi.invite();
      setUrl(res.data.url);
      setTextboxes((prevTextboxes) => [...prevTextboxes, res.data.url]);
      setShowButton(false);
    } catch (err: any) {
      if (err.status === 401) {
        alert("認証エラー\n再ログインしてください");
        navigate("/login");
      } else {
        alert("読み込みに失敗しました");
        console.log(err);
      }
    } finally {
      setButtonLoading(false);
    }
  };

  // URLをクリップボードにコピー
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopyMessage("コピーしました。");
  };

  return (
    <div className={styles.container}>
      <h2>共有家計簿への招待</h2>
      <div className={styles.contents}>
        {showButton && (
          <div>
            <LoadingButton
              variant="contained"
              loading={buttonLoading}
              sx={{
                width: "60%",
                margin: "20px auto",
                fontSize: "90%",
                height: "45px",
                fontWeight: "bold",
              }}
              onClick={() => {
                getURL();
              }}
            >
              招待用URLを発行する
            </LoadingButton>
            <Button
              variant="contained"
              color="inherit"
              sx={{
                width: "60%",
                margin: "5px auto",
                fontSize: "90%",
                height: "45px",
                fontWeight: "bold",
              }}
              onClick={() => {
                navigate("/setting");
              }}
            >
              キャンセル
            </Button>
          </div>
        )}
        {textboxes.map((value, index) => (
          <div key={index}>
            <TextField
              type="text"
              defaultValue={value}
              sx={{
                width: "90%",
                margin: "20px auto",
                padding: "5px",
              }}
            />
            <Button
              variant="contained"
              sx={{
                width: "40%",
                margin: "5px auto",
                fontSize: "90%",
                height: "45px",
                fontWeight: "bold",
              }}
              onClick={() => {
                copyToClipboard();
              }}
            >
              URLをコピー
            </Button>
            <div>{copyMessage}</div>
            <p>
              <b>※招待リンクの有効期限は10分間です。</b>
            </p>
            <Button
              variant="contained"
              color="inherit"
              sx={{
                width: "40%",
                margin: "5px auto",
                fontSize: "90%",
                height: "45px",
                fontWeight: "bold",
              }}
              onClick={() => {
                navigate("/setting");
              }}
            >
              戻る
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
