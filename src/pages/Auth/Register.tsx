import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerValidation } from "../../components/util/validation";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { authApi } from "../../api/authApi";
import { CircularProgress, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { RegisterForm } from "../../../src/types";
import { gapi } from "gapi-script";
import { GoogleLogin } from "react-google-login";
import { useCookies } from "react-cookie";

export const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["email"]);
  const [googleLoading, setGoogleLoading] = useState(false);
  const clientId = process.env.REACT_APP_CLIENT_ID;

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerValidation) });

  // Googleログイン用の設定
  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", start);
  });

  // メールアドレスで新規登録ボタンが押されたときの処理
  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      // DBに新規登録
      const registerData = {
        email: data.email,
        password: data.password,
        name: data.name,
        type: 1,
      };
      const res = await authApi.register(registerData);
      if (res.status === 200) {
        setCookie("email", data.email);
        console.log(cookies.email);
        alert("設定されたメールアドレス宛に認証コードを送信しました");
        navigate("/verify-email");
      } else if (res.status === 409) {
        alert("すでに使用されているメールアドレスです");
      } else {
        alert("新規登録に失敗しました");
      }
    } catch (err: any) {
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // Googleのログインに成功したときの処理
  const onSuccess = async (response: any) => {
    setGoogleLoading(true);
    try {
      const email = response.profileObj.email;
      const name = response.profileObj.name;

      const res = await authApi.register({ email: email, name: name, password: "dummy", type: 2 });
      if (res.status === 200) {
        localStorage.setItem("token", res.data["accessToken"]);
        // localStorage.setItem("refresh", res.data["refreshToken"]);
        alert("登録完了しました");
        navigate("/event-register");
      } else if (res.status === 409) {
        alert("すでに登録されているユーザーです");
      } else {
        alert("登録に失敗しました");
      }
    } catch (err: any) {
      alert("エラーが発生しました");
      console.log(err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>新規登録フォーム</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.form}>
          <TextField
            id="email"
            label="メールアドレス"
            {...register("email")}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            sx={{ width: "90%" }}
          />
        </div>
        <div className={styles.form}>
          <TextField
            id="name"
            label="表示名"
            {...register("name")}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            sx={{ width: "90%" }}
          />
        </div>
        <div className={styles.form}>
          <TextField
            id="password"
            label="パスワード"
            type="password"
            {...register("password")}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            sx={{ width: "90%" }}
          />
        </div>
        <div className={styles.form}>
          <TextField
            id="confirmPassword"
            label="確認用パスワード"
            type="password"
            {...register("confirmPassword")}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
            sx={{ width: "90%" }}
          />
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
            メールアドレスで新規登録
          </LoadingButton>
        </div>
      </form>
      <p className={styles.subText}>または</p>
      <div className={styles.form}>
        <GoogleLogin
          clientId={clientId!}
          buttonText="Googleアカウントで新規登録"
          onSuccess={onSuccess}
          className={styles.google}
          cookiePolicy={"single_host_origin"}
          // isSignedIn={true}
        />
      </div>
      <div style={{ marginLeft: "20px" }}>
        <p className={styles.linkText}>アカウントをお持ちの方は</p>
        <Link to="/login">ログイン</Link>
      </div>
      {googleLoading ? (
        <div className={styles.modal}>
          <CircularProgress />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
