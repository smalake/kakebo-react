import React, { useEffect } from "react";
import styles from "./Setting.module.css";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { settingApi } from "../../api/settingApi";
import { NameChangeForm } from "../../types";

export const ChangeName = () => {
  const navigate = useNavigate();
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
      }
    };
    getName();
  });

  const onSubmit = async (data: NameChangeForm) => {
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
    }
  };

  return (
    <div className={styles.container}>
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
          <Button type="submit" variant="contained" sx={{ width: "60%", margin: "20px auto", fontSize: "90%", height: "45px", fontWeight: "bold" }}>
            変更
          </Button>
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
    </div>
  );
};
