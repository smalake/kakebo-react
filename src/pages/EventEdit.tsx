import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./Event.module.css";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { eventApi } from "../api/eventApi";
import { useNavigate, useParams } from "react-router-dom";

interface EventRegisterForm {
  amount: number;
  category: number;
  storeName: string;
  date: Date;
}

export const EventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [createUser, setCreateUser] = useState("");
  const [updateUser, setUpdateUser] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<EventRegisterForm>();

  useEffect(() => {
    // APIからイベントを取得
    const getEvent = async () => {
      try {
        if (id !== undefined) {
          const event = await eventApi.getOne(parseInt(id));
          setValue("amount", event.data["amount"]);
          setValue("category", event.data["category"]);
          setValue("storeName", event.data["storeName"]);
          setValue("date", event.data["date"]);
          setCreateUser(event.data["createUser"]);
          setCreatedAt(event.data["createdAt"]);
          setUpdateUser(event.data["updateUser"]);
          setUpdatedAt(event.data["updatedAt"]);
        } else {
          alert("読み込みに失敗しました");
        }
      } catch (err) {
        alert("読み込みに失敗しました");
        console.log(err);
      }
    };
    getEvent();
  });

  // 更新ボタンをクリックしたときの処理
  const onSubmit = async (data: EventRegisterForm) => {
    const d = new Date(data.date);
    try {
      // 送信用のフォーマットへと変換
      const send = {
        amount1: Number(data.amount),
        category1: data.category,
        storeName: data.storeName,
        date: d.toISOString(),
      };
      const res = await eventApi.create(send);
      if (res.status === 200) {
        alert("登録しました");
      } else {
        alert("登録に失敗しました");
        console.log(res);
      }
    } catch (err: any) {
      if (err.status === 401) {
        alert("認証エラー\n再ログインしてください");
        navigate("/login");
      } else {
        alert("登録に失敗しました");
        console.log(err);
      }
    }
  };

  const onCancel = () => {
    navigate("/calendar");
  };

  return (
    <>
      <div className={styles.container}>
        <h2>家計簿編集</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.form}>
            <TextField
              id="amount"
              label="金額"
              defaultValue={0}
              error={Boolean(errors.amount)}
              {...register("amount", { required: "金額を入力してください", min: { value: 1, message: "1以上の数値を入力してください" } })}
              type="number"
              helperText={errors.amount?.message}
              sx={{ width: "90%" }}
            />
          </div>
          <div className={styles.form}>
            <Controller
              name="category"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <FormControl sx={{ width: "90%", textAlign: "left" }}>
                  <InputLabel id="category1-label">カテゴリー</InputLabel>
                  <Select {...field} id="category" label="カテゴリー" labelId="category-label">
                    <MenuItem value={0}>未選択</MenuItem>
                    <MenuItem value={1}>食費</MenuItem>
                    <MenuItem value={2}>外食費</MenuItem>
                    <MenuItem value={3}>日用品</MenuItem>
                    <MenuItem value={4}>交通費</MenuItem>
                    <MenuItem value={5}>医療費</MenuItem>
                    <MenuItem value={6}>衣服</MenuItem>
                    <MenuItem value={7}>趣味</MenuItem>
                    <MenuItem value={8}>光熱費</MenuItem>
                    <MenuItem value={9}>通信費</MenuItem>
                    <MenuItem value={10}>その他</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </div>

          <div className={styles.form}>
            <TextField
              id="storeName"
              label="店名"
              defaultValue={" "}
              error={Boolean(errors.storeName)}
              helperText={errors.storeName?.message}
              {...register("storeName", { maxLength: { value: 20, message: "20文字以内で入力してください" } })}
              sx={{ width: "90%" }}
            />
          </div>
          <div className={styles.form}>
            <TextField
              id="date"
              label="日付"
              type="date"
              defaultValue={new Date().toISOString().substr(0, 10)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                style: { paddingRight: "0px" },
              }}
              error={Boolean(errors.date)}
              helperText={errors.date?.message}
              {...register("date", { required: "日付を入力してください" })}
              sx={{ width: "90%" }}
            />
          </div>
          <div className={styles.form}>
            <Button type="submit" variant="contained" color="info" sx={{ width: "90%", height: "45px", fontSize: "16px", fontWeight: "bold" }}>
              更新
            </Button>
          </div>
          <div className={styles.form}>
            <Button
              onClick={onCancel}
              variant="contained"
              color="inherit"
              sx={{ width: "90%", height: "45px", fontSize: "16px", fontWeight: "bold" }}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </div>
      <div className={styles.desc}>
        <div>
          作成: {createUser}さん ({createdAt})
        </div>
        <div>
          更新: {updateUser}さん ({updatedAt})
        </div>
      </div>
    </>
  );
};
