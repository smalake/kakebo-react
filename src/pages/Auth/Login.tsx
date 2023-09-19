import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidation } from "../../components/util/validation";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { LoginForm } from "../../../src/types";
import { authApi } from "../../api/authApi";
import { gapi } from "gapi-script";
import { GoogleLogin } from "react-google-login";

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const clientId = process.env.REACT_APP_CLIENT_ID;

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginValidation) });

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

  // メールアドレスでログインボタンが押されたときの処理
  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const param = {
        email: data.email,
        password: data.password,
      };
      const res = await authApi.login(param);
      if (res.status === 200) {
        localStorage.setItem("token", res.data["accessToken"]);
        localStorage.setItem("refresh", res.data["refreshToken"]);
        navigate("/event-register");
      } else {
        alert("メールアドレスかパスワードが間違っています");
      }
    } catch (err) {
      console.log(err);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // Googleのログインに成功したときの処理
  const onSuccess = async (response: any) => {
    const email = response.profileObj.email;

    const res = await authApi.googleLogin({ email: email });
    try {
      // ユーザ登録されていたらログイン
      if (res.status === 200) {
        localStorage.setItem("token", res.data["accessToken"]);
        localStorage.setItem("refresh", res.data["refreshToken"]);
        navigate("/event-register");
      }
      // 未登録の場合
      else {
        alert("ユーザー情報が登録されていません\nまずは新規登録を行ってください");
        navigate("/register");
      }
    } catch (err: any) {
      console.log(err);
      alert("エラーが発生しました");
    }
  };
  // Googleのログインに失敗したときの処理
  const onFailure = (res: any) => {
    console.log(res);
    alert("ログインに失敗しました");
  };

  return (
    <div className={styles.container}>
      <h2>ログイン</h2>
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
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            color="info"
            sx={{
              width: "90%",
              height: "45px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            メールアドレスでログイン
          </LoadingButton>
        </div>
      </form>
      <p className={styles.subText}>または</p>
      <div className={styles.form}>
        <GoogleLogin
          clientId={clientId!}
          buttonText="Googleアカウントでログイン"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          // isSignedIn={true}
        />
      </div>

      <div style={{ marginLeft: "20px" }}>
        <p className={styles.linkText}>アカウントをお持ちでない方は</p>
        <Link to="/register">新規登録</Link>
      </div>
    </div>
  );
};
