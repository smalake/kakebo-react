import LoadingButton from "@mui/lab/LoadingButton";
import { Box, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./Setting.module.css";

export const Contact = () => {
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setButtonLoading(true);
  };
  return (
    <>
      <div className={styles.container}>
        <Box sx={{ textAlign: "center" }}>
          <h2>お問い合わせ</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.form}>
              <TextField
                id="name"
                label="お名前"
                defaultValue={""}
                sx={{ width: "90%" }}
                error={Boolean(errors.name)}
                {...register("name", { required: "お名前を入力してください" })}
                // helperText={errors.name?.message}
              />
            </div>
            <div className={styles.form}>
              <TextField id="emamil" label="メールアドレス" sx={{ width: "90%" }} />
            </div>
            <div className={styles.form}>
              <TextField id="description" label="お問い合わせ内容" sx={{ width: "90%" }} />
            </div>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={buttonLoading}
              color="info"
              sx={{ width: "90%", height: "45px", fontSize: "16px", fontWeight: "bold" }}
            >
              送信
            </LoadingButton>
          </form>
        </Box>
      </div>
    </>
  );
};
