import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./Event.module.css";
import { TextField } from "@mui/material";

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
  const onSubmit = (data: EventRegisterForm) => {
    console.log(data.amount1);
    console.log(data.category1);
    console.log(data.date);
  };

  return (
    <div className={styles.container}>
      <h2>家計簿入力</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="amount1">金額</label>
          <input
            id="amount1"
            {...register("amount1", { required: "入力必須項目です", min: { value: 1, message: "1以上の数値を入力してください" } })}
            type="number"
          />
          <p className={styles.error}>{errors.amount1?.message as React.ReactNode}</p>
        </div>
        <div>
          <label htmlFor="category1">カテゴリー</label>
          <Controller
            name="category1"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <select {...field} className={styles.category}>
                <option value={0}>未選択</option>
                <option value={1}>食費</option>
                <option value={2}>外食費</option>
                <option value={3}>日用品</option>
                <option value={4}>交通費</option>
                <option value={5}>医療費</option>
                <option value={6}>衣服</option>
                <option value={7}>趣味</option>
                <option value={8}>光熱費</option>
                <option value={9}>通信費</option>
                <option value={10}>その他</option>
              </select>
            )}
          />
          <p></p>
        </div>
        <div>
          <label htmlFor="amount2">金額</label>
          <input id="amount2" {...register("amount2")} type="number" />
          <p className={styles.error}>{errors.amount2?.message as React.ReactNode}</p>
        </div>
        <div>
          <label htmlFor="category2">カテゴリー</label>
          <Controller
            name="category2"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <select {...field} className={styles.category}>
                <option value={0}>未選択</option>
                <option value={1}>食費</option>
                <option value={2}>外食費</option>
                <option value={3}>日用品</option>
                <option value={4}>交通費</option>
                <option value={5}>医療費</option>
                <option value={6}>衣服</option>
                <option value={7}>趣味</option>
                <option value={8}>光熱費</option>
                <option value={9}>通信費</option>
                <option value={10}>その他</option>
              </select>
            )}
          />
          <p></p>
        </div>
        <div>
          <label htmlFor="storeName">店名</label>
          <input id="storeName" {...register("storeName", { maxLength: { value: 20, message: "20文字以内で入力してください" } })} />
          <p className={styles.error}>{errors.storeName?.message as React.ReactNode}</p>
        </div>
        <div>
          <TextField
            id="date"
            label="日付"
            type="date"
            defaultValue={new Date().toISOString().substr(0, 10)}
            InputLabelProps={{
              shrink: true,
            }}
            {...register("date")}
          />
        </div>
        <button type="submit" className={styles.submit}>
          登録
        </button>
      </form>
    </div>
  );
};
