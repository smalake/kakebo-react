import { z } from "zod";

export const registerValidation = z
  .object({
    email: z.string().nonempty("メールアドレスを入力してください").email("メールアドレスの形式が間違っています"),
    name: z.string().nonempty("表示名を入力してください").max(20, "表示名は20文字以内で入力してください"),
    password: z
      .string()
      .nonempty("パスワードを入力してください")
      .min(6, "パスワードは6文字以上、20文字以内で入力してください")
      .max(20, "パスワードは6文字以上、20文字以内で入力してください"),
    confirmPassword: z.string().nonempty("確認用パスワードを入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "パスワードが一致しません",
  });

export const loginValidation = z.object({
  email: z.string().nonempty("メールアドレスを入力してください").email("メールアドレスの形式が間違っています"),
  password: z.string().nonempty("パスワードを入力してください"),
});
