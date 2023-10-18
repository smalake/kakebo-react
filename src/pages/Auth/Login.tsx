import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidation } from "../../components/util/validation";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { TextField, Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
import { LoginForm } from "../../../src/types";
import { authApi } from "../../api/authApi";
import { gapi } from "gapi-script";
import { GoogleLogin } from "react-google-login";
import { eventApi } from "../../api/eventApi";
import { db } from "../../db/db";
import { privateApi } from "../../api/privateApi";

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const clientId = process.env.REACT_APP_CLIENT_ID;

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginValidation) });

  // ログインチェック
  useEffect(() => {
    const loginCheck = async () => {
      try {
        if (localStorage.getItem("token")) {
          const res = await authApi.isLogin();
          if (res.status === 200) {
            navigate("/event-register");
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loginCheck();
  }, [navigate]);

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
    setButtonLoading(true);
    try {
      const param = {
        email: data.email,
        password: data.password,
      };
      const res = await authApi.login(param);
      if (res.status === 200) {
        localStorage.setItem("token", res.data["accessToken"]);
        // localStorage.setItem("refresh", res.data["refreshToken"]);
        const eventData = await eventApi.getAll();
        const privateData = await privateApi.getAll();
        const revision = await eventApi.revision();
        db.open()
          .then(() => {
            db.transaction("rw", db.event, db.private, () => {
              db.event.bulkAdd(eventData.data.events);
              db.private.bulkAdd(privateData.data.events);
            }).then(() => {
              // リビジョンを保存
              localStorage.setItem("revision", revision.data.revision);
              navigate("/event-register");
            });
          })
          .catch((error) => {
            console.log(error);
            localStorage.removeItem("token");
            alert("エラーが発生しました");
          });
      } else if (res.status === 400) {
        alert("メールアドレスの認証が完了していません");
      } else {
        alert("メールアドレスかパスワードが間違っています");
      }
    } catch (err) {
      console.log(err);
      alert("エラーが発生しました");
    } finally {
      setButtonLoading(false);
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
        // localStorage.setItem("refresh", res.data["refreshToken"]);
        const eventData = await eventApi.getAll();
        const privateData = await privateApi.getAll();
        const revision = await eventApi.revision();
        db.open()
          .then(() => {
            db.transaction("rw", db.event, db.private, () => {
              db.event.bulkAdd(eventData.data.events);
              db.private.bulkAdd(privateData.data.events);
            }).then(() => {
              // リビジョンを保存
              localStorage.setItem("revision", revision.data.revision);
              navigate("/event-register");
            });
          })
          .catch((error) => {
            console.log(error);
            localStorage.removeItem("token");
            alert("エラーが発生しました");
          });
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
        <>
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
                loading={buttonLoading}
                color="info"
                sx={{
                  width: "70%",
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
              className={styles.google}
              // isSignedIn={true}
            />
          </div>

          <div style={{ marginLeft: "20px" }}>
            <p className={styles.linkText}>アカウントをお持ちでない方は</p>
            <Link to="/register">新規登録</Link>
          </div>
        </>
      )}
    </div>
  );
};
