import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidation } from "../../components/util/validation";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { Button, TextField } from "@mui/material";
import { LoginForm } from "../../../src/types";
import { authApi } from "../../api/authApi";

export const Login = () => {
  const navigate = useNavigate();
  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginValidation) });

  // メールアドレスでログインボタンが押されたときの処理
  const onSubmit = async (data: LoginForm) => {
    try {
      const param = {
        email: data.email,
        password: data.password,
      };
      const res = await authApi.login(param);
      localStorage.setItem("token", res.data["api_token"]);
      navigate("/event-register");
    } catch (err) {
      console.log(err);
      alert("メールアドレスかパスワードが間違っています");
    }
  };

  //   // Googleで新規登録ボタンが押されたときの処理
  //   const handleGoogle = async () => {
  //     try {
  //       const { uid, token } = await googleLogin();
  //       if (token !== undefined) {
  //         const loginData = { uid: uid };
  //         // apiLogin(loginData);
  //       } else {
  //         alert("認証エラーが発生しました\nアカウントが登録されていない、またはパスワードが間違っています");
  //       }
  //     } catch (err) {
  //       if (err instanceof FirebaseError) {
  //         if (err.code === "auth/popup-closed-by-user") {
  //           // ユーザがキャンセルした場合
  //           // 何も処理を行わない
  //         } else {
  //           alert(err);
  //         }
  //       } else {
  //         alert(err);
  //       }
  //     }
  //   };

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
          <Button
            type="submit"
            variant="contained"
            color="info"
            sx={{
              width: "90%",
              height: "45px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            メールアドレスでログイン
          </Button>
        </div>
      </form>
      {/* <p className={styles.subText}>または</p>
      <div className={styles.form}>
        <button className={styles.google} onClick={handleGoogle}>
          Googleアカウントでログイン
        </button>
      </div> */}
      <div style={{ marginLeft: "20px" }}>
        <p className={styles.linkText}>アカウントをお持ちでない方は</p>
        <Link to="/register">新規登録</Link>
      </div>
    </div>
  );
};
