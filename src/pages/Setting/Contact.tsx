import LoadingButton from "@mui/lab/LoadingButton";
import { Box, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Setting.module.css";
import { settingApi } from "../../api/settingApi";

export const Contact = () => {
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);

  interface SendData {
    email: string;
    name: string;
    description: string;
  }

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendData>();

  const onSubmit = async (data: SendData) => {
    setButtonLoading(true);
    try {
      const send = {
        email: data.email,
        name: data.name,
        description: data.description,
      };
      const res = await settingApi.sendMail(send);
      if (res.status === 200) {
        alert("お問い合わせありがとうございます。\n確認した後返信させていただきます。");
        navigate("/setting");
      }
    } catch (err: any) {
      alert("エラーが発生しました");
    }
  };
  return (
    <>
      <div className={styles.container}>
        <Box sx={{ textAlign: "center" }}>
          <h2>お問い合わせ</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.contactForm}>
              <TextField
                id="name"
                label="お名前"
                defaultValue={""}
                sx={{ width: "90%" }}
                error={Boolean(errors.name)}
                {...register("name", { required: "お名前を入力してください" })}
                helperText={errors.name?.message}
              />
            </div>
            <div className={styles.contactForm}>
              <TextField
                id="emamil"
                label="返信先のメールアドレス"
                sx={{ width: "90%" }}
                error={Boolean(errors.email)}
                {...register("email", { required: "メールアドレスを入力してください" })}
                helperText={errors.email?.message}
              />
            </div>
            <div className={styles.contactForm}>
              <TextField
                id="description"
                label="お問い合わせ内容"
                multiline
                rows={4}
                sx={{ width: "90%" }}
                error={Boolean(errors.description)}
                {...register("description", { required: "お問い合わせ内容を入力してください" })}
                helperText={errors.description?.message}
              />
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
        <Link to="/setting" className={styles.toBack}>
          戻る
        </Link>
      </div>
    </>
  );
};
