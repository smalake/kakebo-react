import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { authApi } from "../../api/authApi";
import { Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useCookies } from "react-cookie";

export interface AuthCode {
  code: string;
}

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["email"]);

  // react-hook-formの設定
  const { register, handleSubmit } = useForm<AuthCode>();

  // メールアドレスで新規登録ボタンが押されたときの処理
  const onSubmit = async (data: AuthCode) => {
    setLoading(true);
    try {
      // DBに新規登録
      const verifyData = {
        code: data.code,
        email: cookies.email,
      };
      const res = await authApi.verifyEmail(verifyData);
      if (res.status === 200) {
        alert("登録が完了しました");
        navigate("/login");
      } else if (res.status === 401) {
        if (res.data.message === "expired") {
          alert("認証コードの有効期限が切れています\nもう一度登録し直してください");
          navigate("/register");
        } else {
          alert("認証コードが間違っています");
        }
      } else {
        alert("エラーが発生しました");
      }
    } catch (err: any) {
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };
  const resend = async () => {
    const res = await authApi.resendCode();
    if (res.status === 200) {
      alert("認証コードを再送信しました");
    } else {
      alert("エラーが発生しました");
    }
  };

  return (
    <div className={styles.container}>
      <h2>メールアドレス認証</h2>
      <div className={styles.description}>
        設定したメールアドレスに送られた
        <br />
        認証コードを入力してください。
        <br />
        （※ 有効期限は5分です。）
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.authForm}>
          <TextField id="code" {...register("code", { required: "認証コードを入力してください" })} sx={{ width: "90%" }} />
        </div>
        <div className={styles.description}>
          <Button onClick={resend}>認証コードを再送信</Button>
        </div>
        <div className={styles.form}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            color="info"
            sx={{
              width: "70%",
              height: "45px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            認証
          </LoadingButton>
        </div>
      </form>
      <Link to="/" className={styles.description}>
        TOPへ
      </Link>
    </div>
  );
};
