import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { patternApi } from "../../api/patternApi";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import styles from "./Setting.module.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { PatternSelector, patternAtom } from "../../recoil/PatternAtom";
import { Pattern } from "../../types";
import { CategoryIcon } from "../../components/Category";
import { categoryAtom } from "../../recoil/CategoryAtom";
import { Controller, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";

export const PatternSetting = () => {
  const navigate = useNavigate();
  const [hasPattern, setHasPattern] = useState(false);
  const [patternFlag, setPatternFlag] = useRecoilState(patternAtom);
  const [patternId, setPatternId] = useState(0);
  const patternList = useRecoilValue(PatternSelector);
  const categories = useRecoilValue(categoryAtom);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);
  const [modalFlag, setModalFlag] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Pattern>();

  // パターンの取得
  useEffect(() => {
    const patternCheck = async () => {
      const pat = await patternList;
      if (pat[0].id) {
        // パターン更新用
        const flag = patternFlag + 1;
        setPatternFlag(flag);
        setHasPattern(true);
      } else {
        setHasPattern(false);
      }
    };
    patternCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 保存ボタンをクリックしたときの処理
  const onSubmit = async (data: Pattern) => {
    setButtonLoading(true);
    try {
      const send = {
        store_name: data.store_name,
        category: data.category,
      };
      const res = await patternApi.save(patternId, send);
      if (res.status === 200) {
        alert("保存しました");
        navigate("/setting");
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

  // 削除ボタンをクリックしたときの処理
  const onDelete = async () => {
    setDeleteButtonLoading(true);
    try {
      const res = await patternApi.delete(patternId);
      if (res.status === 200) {
        alert("削除しました");
        navigate("/setting");
      } else {
        alert("削除に失敗しました");
      }
    } catch (err: any) {
      if (err.status === 401) {
        alert("認証エラー\n再ログインしてください");
        navigate("/login");
      } else {
        alert("削除に失敗しました");
        console.log(err);
      }
    } finally {
      setButtonLoading(false);
    }
  };

  // モーダルウィンドウ内に選択したパターンの値を表示させる
  const getPatternOne = async (item: Pattern) => {
    setModalFlag(true);
    setValue("category", item.category);
    setValue("store_name", item.store_name);
    setPatternId(item.id);
  };

  return (
    <div className={styles.container}>
      <h2>お気に入りの登録・編集</h2>
      <ul className={styles.list}>
        {hasPattern ? (
          patternList.map((item: Pattern) => (
            <li key={item.id} className={styles.listItem}>
              <div className={styles.listItem}>
                <Button
                  sx={{ marginTop: "15px" }}
                  onClick={() => {
                    getPatternOne(item);
                  }}
                >
                  <span className={styles.icon}>
                    <CategoryIcon catNum={item.category} />
                  </span>
                  {categories[item.category].name} ({item.store_name})
                </Button>
              </div>
            </li>
          ))
        ) : (
          <div></div>
        )}
        <li className={styles.listItem}>
          <Button
            variant="outlined"
            sx={{ marginTop: "15px" }}
            onClick={() => {
              navigate("/pattern-register");
            }}
          >
            お気に入りを登録
          </Button>
        </li>
      </ul>
      <Link to="/setting" className={styles.toBack}>
        戻る
      </Link>
      {modalFlag ? (
        <div className={styles.modal}>
          <div className={styles.modalContainer}>
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
              <LoadingButton
                variant="contained"
                color="error"
                onClick={onDelete}
                loading={deleteButtonLoading}
                sx={{ width: "70%", margin: "10px auto" }}
              >
                削除
              </LoadingButton>
              <Button
                onClick={() => {
                  setModalFlag(false);
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
      ) : (
        <div></div>
      )}
    </div>
  );
};
