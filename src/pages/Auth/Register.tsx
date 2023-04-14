import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerValidation } from "../../util/validationSchema";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import styles from "./Auth.module.css";
import { FirebaseError } from "firebase/app";
import { useCookies } from "react-cookie";
import { authApi } from "../../api/authApi";
import { googleLogin } from "../../util/googleLogin";

// 型の設定
interface RegisterForm {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export const Register = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerValidation) });

  // メールアドレスで新規登録ボタンが押されたときの処理
  const onSubmit = async (data: RegisterForm) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const token = await userCredential.user.getIdToken(); // トークンを取得
      const uid = userCredential.user.uid;
      // DBに新規登録
      const registerData = { uid: uid, name: data.name, type: 1 };
      apiRegister(JSON.stringify(registerData), token);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/email-already-in-use") {
          alert("すでに使用されているメールアドレスです");
        } else {
          alert(err);
        }
      } else {
        alert(err);
      }
    }
  };

  // Googleで新規登録ボタンが押されたときの処理
  const handleGoogle = async () => {
    try {
      // googleアカウントにログインして登録を行う
      const { uid, token, name } = await googleLogin();
      if (token !== undefined) {
        const registerData = { uid: uid, name: name, type: 2 };
        apiRegister(JSON.stringify(registerData), token);
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

  //APIサーバへのユーザ新規登録処理
  const apiRegister = async (data: string, token: string) => {
    try {
      const res = await authApi.register(data);
      if (res.status === 200) {
        setCookie("kakebo", token); // トークンをCookieにセット
        navigate("/input");
      } else {
        alert("新規登録に失敗しました");
      }
    } catch (err) {
      alert("エラーが発生しました");
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>新規登録フォーム</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input id="email" {...register("email")} />
          <p className={styles.error}>{errors.email?.message as React.ReactNode}</p>
        </div>
        <div>
          <label htmlFor="name">表示名</label>
          <input id="name" {...register("name")} />
          <p className={styles.error}>{errors.name?.message as React.ReactNode}</p>
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input id="password" type="password" {...register("password")} />
          <p className={styles.error}>{errors.password?.message as React.ReactNode}</p>
        </div>
        <div>
          <label htmlFor="confirmPassword">確認用パスワード</label>
          <input id="confirmPassword" type="password" {...register("confirmPassword")} />
          <p className={styles.error}>{errors.confirmPassword?.message as React.ReactNode}</p>
        </div>
        <button className={styles.submit} type="submit">
          メールアドレスで新規登録
        </button>
      </form>
      <p className={styles.subText}>または</p>
      <button className={styles.google} onClick={handleGoogle}>
        Googleアカウントで新規登録
      </button>
      <div>
        <p className={styles.linkText}>アカウントをお持ちの方は</p>
        <Link to="/login">ログイン</Link>
      </div>
    </div>
  );
};
