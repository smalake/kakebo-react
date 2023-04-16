import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidation } from "../../util/validationSchema";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import styles from "./Auth.module.css";
import { useCookies } from "react-cookie";
import { authApi } from "../../api/authApi";
import { googleLogin } from "../../util/googleLogin";
import { FirebaseError } from "firebase/app";
import { Button, TextField } from "@mui/material";

// 型の設定
interface LoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies();

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginValidation) });

  // メールアドレスでログインボタンが押されたときの処理
  const onSubmit = async (data: LoginForm) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const token = await userCredential.user.getIdToken(); // トークンを取得
      const uid = userCredential.user.uid;

      // TODO: Recoilにトークンを登録
      // ユーザ情報がAPIサーバに登録されているかチェック
      const loginData = { uid: uid };
      apiLogin(JSON.stringify(loginData), token);
    } catch (err) {
      console.log(err);
      alert("メールアドレスかパスワードが間違っています");
    }
  };

  // Googleで新規登録ボタンが押されたときの処理
  const handleGoogle = async () => {
    try {
      const { uid, token } = await googleLogin();
      if (token !== undefined) {
        const loginData = { uid: uid };
        apiLogin(JSON.stringify(loginData), token);
      } else {
        alert("認証エラーが発生しました\nアカウントが登録されていない、またはパスワードが間違っています");
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/popup-closed-by-user") {
          // ユーザがキャンセルした場合
          // 何も処理を行わない
        } else {
          alert(err);
        }
      } else {
        alert(err);
      }
    }
  };

  // APIサーバへのログイン処理
  const apiLogin = async (data: string, token: string) => {
    try {
      const res = await authApi.login(data);
      if (res.status === 200) {
        const now = new Date();
        setCookie("kakebo", token, { expires: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) }); // トークンをCookieにセット（有効期限1週間）
        navigate("/event-register");
      } else {
        alert("認証エラーが発生しました\nアカウントが登録されていない、またはパスワードが間違っています");
      }
    } catch (err) {
      console.log(err);
      alert("認証エラーが発生しました\nアカウントが登録されていない、またはパスワードが間違っています");
    }
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
            sx={{ width: "100%" }}
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
            sx={{ width: "100%" }}
          />
        </div>
        <Button type="submit" variant="contained" color="info" sx={{ width: "100%", height: "45px", fontSize: "16px", fontWeight: "bold" }}>
          メールアドレスでログイン
        </Button>
      </form>
      <p className={styles.subText}>または</p>
      <button className={styles.google} onClick={handleGoogle}>
        Googleアカウントでログイン
      </button>
      <div>
        <p className={styles.linkText}>アカウントをお持ちでない方は</p>
        <Link to="/register">新規登録</Link>
      </div>
    </div>
  );
};
