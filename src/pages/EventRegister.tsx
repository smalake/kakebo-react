import React from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./Event.module.css";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { eventApi } from "../api/eventApi";
import { useNavigate } from "react-router-dom";

interface EventRegisterForm {
  amount1: number;
  amount2: number;
  category1: number;
  category2: number;
  storeName: string;
  date: Date;
}

export const EventRegister = () => {
  const navigate = useNavigate();
  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventRegisterForm>();

  // 登録ボタンをクリックしたときの処理
  const onSubmit = async (data: EventRegisterForm) => {
    const d = new Date(data.date);
    try {
      // 送信用のフォーマットへと変換
      const send = {
        amount1: Number(data.amount1),
        amount2: Number(data.amount2 || 0),
        category1: data.category1,
        category2: data.category2,
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

  return (
    <div className={styles.container}>
      <h2>家計簿入力</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.form}>
          <TextField
            id="amount1"
            label="金額"
            defaultValue={0}
            error={Boolean(errors.amount1)}
            {...register("amount1", { required: "金額を入力してください", min: { value: 1, message: "1以上の数値を入力してください" } })}
            type="number"
            helperText={errors.amount1?.message}
            sx={{ width: "90%" }}
          />
        </div>
        <div className={styles.form}>
          <Controller
            name="category1"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <FormControl sx={{ width: "90%", textAlign: "left" }}>
                <InputLabel id="category1-label">カテゴリー</InputLabel>
                <Select {...field} id="category1" label="カテゴリー" labelId="category1-label">
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
          <TextField id="amount2" defaultValue={0} label="金額" {...register("amount2")} type="number" sx={{ width: "90%" }} />
        </div>
        <div className={styles.form}>
          <Controller
            name="category2"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <FormControl sx={{ width: "90%", textAlign: "left" }}>
                <InputLabel id="category2-label">カテゴリー</InputLabel>
                <Select {...field} id="category2" label="カテゴリー" labelId="category2-label">
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
            登録
          </Button>
        </div>
      </form>
    </div>
  );
};
