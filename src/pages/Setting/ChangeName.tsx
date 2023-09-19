import React, { useEffect, useState } from "react";
import styles from "./Setting.module.css";
import { Button, TextField, Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { settingApi } from "../../api/settingApi";
import { NameChangeForm } from "../../types";

export const ChangeName = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NameChangeForm>();

  useEffect(() => {
    // APIから表示名を取得
    const getName = async () => {
      try {
        const res = await settingApi.getName();
        setValue("name", res.data["name"]);
      } catch (err: any) {
        if (err.status === 401) {
          alert("認証エラー\n再ログインしてください");
          navigate("/login");
        } else {
          alert("読み込みに失敗しました");
          console.log(err);
        }
      } finally {
        setLoading(false);
      }
    };
    getName();
  });

  const onSubmit = async (data: NameChangeForm) => {
    setButtonLoading(true);
    try {
      const send = {
        name: data.name,
      };
      const res = await settingApi.updateName(send);
      if (res.status === 200) {
        navigate("/setting");
        alert("更新しました");
      } else {
        alert("更新に失敗しました");
        console.log(res);
      }
    } catch (err: any) {
      if (err.status === 401) {
        alert("認証エラー\n再ログインしてください");
        navigate("/login");
      } else {
        alert("更新に失敗しました");
        console.log(err);
      }
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
            marginTop: "330px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <h2>表示名の変更</h2>
          <div className={styles.contents}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                id="name"
                label="表示名"
                defaultValue=" "
                {...register("name", { required: "表示名を入力してください", maxLength: { value: 20, message: "20文字以内で入力してください" } })}
                error={Boolean(errors.name)}
                sx={{ width: "90%", margin: "20px auto" }}
              />
              <LoadingButton
                type="submit"
                variant="contained"
                loading={buttonLoading}
                sx={{ width: "60%", margin: "20px auto", fontSize: "90%", height: "45px", fontWeight: "bold" }}
              >
                変更
              </LoadingButton>
              <Button
                variant="contained"
                color="inherit"
                sx={{ width: "60%", margin: "5px auto", fontSize: "90%", height: "45px", fontWeight: "bold" }}
                onClick={() => {
                  navigate("/setting");
                }}
              >
                キャンセル
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
