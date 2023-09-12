import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerValidation } from "../../components/util/validation";
import { useNavigate, useParams } from "react-router-dom";
import { authApi } from "../../api/authApi";
import styles from "./Auth.module.css";
import { Button, TextField, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { RegisterForm } from "../../../src/types";

export const Join = () => {
  const navigate = useNavigate();
  const { group } = useParams();
  const [parentName, setParentName] = useState("");
  const [loading, setLoading] = useState(true);

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerValidation) });

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
    getParentName();
  }, []);

  const onSubmit = async (data: RegisterForm) => {
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
        localStorage.setItem("refresh", res.data["refreshToken"]);
        alert("登録完了しました");
        navigate("/event-register");
      } else {
        console.log(res);
        alert("認証エラーが発生しました");
      }
    } catch (err) {
      console.log(err);
      alert("認証エラーが発生しました");
    }
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "330px",
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
                    {parentName}さんの家計簿に参加
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div>無効なリンクです</div>
          )}
        </div>
      )}
    </div>
  );
};
