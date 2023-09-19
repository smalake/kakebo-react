import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./Event.module.css";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { eventApi } from "../api/eventApi";
import { useNavigate } from "react-router-dom";
import { EventRegisterForm } from "../types";

export const EventRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(false);

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EventRegisterForm>();

  // 登録ボタンをクリックしたときの処理
  const onSubmit = async (data: EventRegisterForm) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // 追加ボタンを押したときの処理
  const addSeconds = () => {
    setDisplay(true);
  };
  // 削除ボタンを押したときの処理
  const removeSeconds = () => {
    setDisplay(false);
    reset({ amount2: 0 });
  };

  return (
    <div className={styles.container}>
      <h2>家計簿入力</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.form}>
          <TextField
            id="amount1"
            label="金額"
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
                  <MenuItem value={0}>食費</MenuItem>
                  <MenuItem value={1}>外食費</MenuItem>
                  <MenuItem value={2}>日用品</MenuItem>
                  <MenuItem value={3}>交通費</MenuItem>
                  <MenuItem value={4}>医療費</MenuItem>
                  <MenuItem value={5}>衣服</MenuItem>
                  <MenuItem value={6}>趣味</MenuItem>
                  <MenuItem value={7}>光熱費</MenuItem>
                  <MenuItem value={8}>通信費</MenuItem>
                  <MenuItem value={9}>その他</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </div>
        {display && (
          <div>
            <div className={styles.form}>
              <TextField id="amount2" label="金額" {...register("amount2")} type="number" sx={{ width: "90%" }} />
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
                      <MenuItem value={0}>食費</MenuItem>
                      <MenuItem value={1}>外食費</MenuItem>
                      <MenuItem value={2}>日用品</MenuItem>
                      <MenuItem value={3}>交通費</MenuItem>
                      <MenuItem value={4}>医療費</MenuItem>
                      <MenuItem value={5}>衣服</MenuItem>
                      <MenuItem value={6}>趣味</MenuItem>
                      <MenuItem value={7}>光熱費</MenuItem>
                      <MenuItem value={8}>通信費</MenuItem>
                      <MenuItem value={9}>その他</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </div>
        )}
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
        {!display && (
          <div className={styles.addButton}>
            <Button
              variant="outlined"
              onClick={() => {
                addSeconds();
              }}
            >
              カテゴリー追加
            </Button>
          </div>
        )}
        {display && (
          <div className={styles.addButton}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                removeSeconds();
              }}
            >
              追加カテゴリー削除
            </Button>
          </div>
        )}
        <div className={styles.form}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            color="info"
            sx={{ width: "90%", height: "45px", fontSize: "16px", fontWeight: "bold" }}
          >
            登録
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
