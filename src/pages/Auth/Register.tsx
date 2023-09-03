import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerValidation } from "../../components/util/validation";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { authApi } from "../../api/authApi";
import { Button, TextField } from "@mui/material";
import { RegisterForm } from "../../../src/types";

export const Register = () => {
  const navigate = useNavigate();

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerValidation) });

  // メールアドレスで新規登録ボタンが押されたときの処理
  const onSubmit = async (data: RegisterForm) => {
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
        alert("登録完了しました");
        navigate("/login");
      } else {
        alert("新規登録に失敗しました");
      }
    } catch (err: any) {
      alert("エラーが発生しました");
      console.log(err);
    }
  };

  // Googleで新規登録ボタンが押されたときの処理
  const handleGoogle = async () => {
    // try {
    //     // googleアカウントにログインして登録を行う
    //     const { uid, token, name } = await googleLogin();
    //     if (token !== undefined) {
    //         const registerData = { uid: uid, name: name, type: 2 };
    //         apiRegister(registerData, token);
    //     }
    // } catch (err) {
    //     if (err instanceof FirebaseError) {
    //         if (err.code === "auth/popup-closed-by-user") {
    //             // ユーザがキャンセルした場合
    //             // 何も処理を行わない
    //         } else {
    //             alert(err);
    //         }
    //     } else {
    //         alert(err);
    //     }
    // }
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
            メールアドレスで新規登録
          </Button>
        </div>
      </form>
      {/* <p className={styles.subText}>または</p>
      <div className={styles.form}>
        <button className={styles.google} onClick={handleGoogle}>
          Googleアカウントで新規登録
        </button>
      </div> */}
      <div style={{ marginLeft: "20px" }}>
        <p className={styles.linkText}>アカウントをお持ちの方は</p>
        <Link to="/login">ログイン</Link>
      </div>
    </div>
  );
};
