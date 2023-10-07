import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerValidation } from "../../components/util/validation";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../api/authApi";
import styles from "./Auth.module.css";
import { TextField, Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
import { RegisterForm } from "../../../src/types";
import { gapi } from "gapi-script";
import { GoogleLogin } from "react-google-login";

export const Join = () => {
  const [params] = useSearchParams();
  const group = params.get("group");
  const navigate = useNavigate();
  const [parentName, setParentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
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

  useEffect(() => {
    const getParentName = async () => {
      try {
        const res = await authApi.getName(group!);
        if (res.status === 200) {
          setParentName(res.data.name);
        } else {
          alert("エラーが発生しました\nお手数ですがお問い合わせしてください");
        }
      } catch (err) {
        alert("エラーが発生しました\nお手数ですがお問い合わせしてください");
      } finally {
        setLoading(false);
      }
    };
    console.log(group);
    getParentName();
  }, [group]);

  // Googleのログインに成功したときの処理
  const onSuccess = async (response: any) => {
    try {
      const email = response.profileObj.email;
      const name = response.profileObj.name;

      const res = await authApi.join({ email: email, name: name, password: "dummy", type: 2, group: group });
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
    }
  };
  // Googleのログインに失敗したときの処理
  const onFailure = (res: any) => {
    console.log(res);
    alert("ログインに失敗しました");
  };

  const onSubmit = async (data: RegisterForm) => {
    setButtonLoading(true);
    try {
      // DBに新規登録
      const registerData = {
        email: data.email,
        password: data.password,
        name: data.name,
        type: 1,
        group: group,
      };
      const res = await authApi.join(registerData);
      if (res.status === 200) {
        localStorage.setItem("token", res.data["accessToken"]);
        // localStorage.setItem("refresh", res.data["refreshToken"]);
        alert("登録完了しました");
        navigate("/event-register");
      } else {
        console.log(res);
        alert("認証エラーが発生しました");
      }
    } catch (err) {
      console.log(err);
      alert("認証エラーが発生しました");
    } finally {
      setButtonLoading(false);
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
          {parentName ? (
            <div>
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
                    loading={buttonLoading}
                    color="info"
                    sx={{
                      width: "70%",
                      height: "45px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {parentName}さんの家計簿に参加
                  </LoadingButton>
                </div>
              </form>
              <div className={styles.form}>
                <GoogleLogin
                  clientId={clientId!}
                  buttonText="Googleアカウントで参加"
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  className={styles.google}
                  cookiePolicy={"single_host_origin"}
                  // isSignedIn={true}
                />
              </div>
            </div>
          ) : (
            <div>無効なリンクです</div>
          )}
        </div>
      )}
    </div>
  );
};
