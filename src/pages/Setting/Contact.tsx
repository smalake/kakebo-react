import LoadingButton from "@mui/lab/LoadingButton";
import { TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
  return (
    <>
      <div>
        <h2>お問い合わせ</h2>
        <TextField id="name" label="お名前" />
        <TextField id="emamil" label="メールアドレス" />
        <TextField id="description" label="お問い合わせ内容" />
        <LoadingButton
          type="submit"
          variant="contained"
          loading={buttonLoading}
          color="info"
          sx={{ width: "90%", height: "45px", fontSize: "16px", fontWeight: "bold" }}
        >
          送信
        </LoadingButton>
      </div>
    </>
  );
};
