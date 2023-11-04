import { Controller, useForm } from "react-hook-form";
import { patternApi } from "../../api/patternApi";
import { Pattern } from "../../types";
import { useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import styles from "./Setting.module.css";
import { useNavigate } from "react-router-dom";

export const PatternRegister = () => {
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Pattern>();
  const onSubmit = async (data: Pattern) => {
    setButtonLoading(true);
    try {
      const send = {
        store_name: data.store_name,
        category: data.category,
      };
      const res = await patternApi.register(send);
      if (res.status === 200) {
        alert("登録しました");
        navigate("/pattern-setting");
      } else if (res.status === 403) {
        alert("お気に入りは3件までしか登録できません");
      } else {
        alert("更新に失敗しました");
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
    <div>
      <div className={styles.container}>
        <h2>お気に入りを登録する</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
          <div className={styles.form}>
            <TextField
              id="store_name"
              label="店名"
              error={Boolean(errors.store_name)}
              {...register("store_name", { required: "店名を入力してください" })}
              helperText={errors.store_name?.message}
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
                  <InputLabel id="category-label">カテゴリー</InputLabel>
                  <Select {...field} id="category" label="カテゴリー" labelId="category-label">
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
          <LoadingButton type="submit" variant="contained" loading={buttonLoading} sx={{ width: "70%", margin: "40px auto 15px auto" }}>
            保存
          </LoadingButton>
          <Button
            onClick={() => {
              navigate("/pattern-setting");
            }}
            variant="contained"
            color="inherit"
            sx={{ width: "70%", margin: "10px auto" }}
          >
            キャンセル
          </Button>
        </form>
      </div>
    </div>
  );
};
