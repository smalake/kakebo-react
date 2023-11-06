import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./Event.module.css";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, ThemeProvider } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { eventApi } from "../../api/eventApi";
import { useNavigate } from "react-router-dom";
import { EventRegisterForm, Pattern } from "../../types";
import { db } from "../../db/db";
import { useRecoilState, useRecoilValue } from "recoil";
import { eventFlagAtom } from "../../recoil/EventAtom";
import { privateFlagAtom } from "../../recoil/PrivateAtom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { PatternSelector, patternAtom } from "../../recoil/PatternAtom";
import { CategoryIcon } from "../../components/Category";
import { createTheme } from "@mui/material";
import { categoryAtom } from "../../recoil/CategoryAtom";

export const EventRegister = () => {
  const navigate = useNavigate();
  const [hasPattern, setHasPattern] = useState(false);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(false);
  const [amount2, setAmount2] = useState(0);
  const [addedAmount, setAddedAmount] = useState(0);
  const [eventFlag, setEventFlag] = useRecoilState(eventFlagAtom);
  const [privateFlag, setPrivateFlag] = useRecoilState(privateFlagAtom);
  const categories = useRecoilValue(categoryAtom);
  const [modalFlag, setModalFlag] = useState(false);
  const patternList = useRecoilValue(PatternSelector);
  const [patternFlag, setPatternFlag] = useRecoilState(patternAtom);

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EventRegisterForm>();

  const theme = createTheme({
    components: {
      // TextField 関連のコンポーネントのスタイルを調整する
      MuiInputLabel: {
        styleOverrides: {
          formControl: {
            // 移動をクリック時に動かないように固定
            position: "static",
            transform: "none",
            transition: "none",
            // クリックを可能に
            pointerEvents: "auto",
            cursor: "pointer",
            // 幅いっぱいを解除
            display: "inline",
            alignSelf: "start",
            // タイポグラフィを指定
            fontWeight: "bold",
            fontSize: "0.75rem",
            // テーマの Composition を使えば以下のようにも書ける
            // base.typography.subtitle2
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            // デフォルトだと、
            // ラベルをはみ出させるための小さなmarginがある
            marginTop: 0,
          },
          input: {
            paddingTop: "10px",
            paddingBottom: "8px",
            height: "auto",
          },
          notchedOutline: {
            // デフォルトだと、 position が absolute、
            // ラベルをはみ出させるため上に少しの余白がある
            top: 0,
            legend: {
              // 内包された legend 要素によって、四角の左側の切り欠きが実現されているので、
              // 表示されないように。
              // (SCSS と同様にネスト記述が可能です。)
              display: "none",
            },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            // フォーム下部のテキスト、エラーメッセージ
            // お好みで左余白を無くしています。
            marginLeft: 0,
          },
        },
      },
    },
  });

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

  // 登録ボタンをクリックしたときの処理
  const onSubmit = async (data: EventRegisterForm) => {
    setLoading(true);
    const d = new Date(data.date);
    // Recoil Selectorの再計算用
    const flag = eventFlag + 1;
    const pflag = privateFlag + 1;
    var amnt2;
    // 追加カテゴリーの有無によって処理を分岐
    if (addedAmount === 0) {
      amnt2 = amount2;
    } else {
      amnt2 = addedAmount;
    }
    try {
      // 送信用のフォーマットへと変換
      const send = {
        amount1: Number(data.amount1),
        amount2: Number(amnt2),
        category1: data.category1,
        category2: data.category2,
        memo1: data.memo1,
        memo2: data.memo2,
        store_name: data.storeName,
        date: d.toISOString(),
        isPrivate: data.isPrivate,
      };
      const res = await eventApi.create(send);
      if (res.status === 200) {
        // DBに登録した内容をIndexedDBに保存
        if (res.data.data.length === 2) {
          const toDB = [
            {
              id: res.data.data[0],
              amount: data.amount1 - amnt2,
              category: data.category1,
              store: data.storeName,
              date: String(data.date),
            },
            {
              id: res.data.data[1],
              amount: Number(amnt2),
              category: data.category2,
              store: data.storeName,
              date: String(data.date),
            },
          ];
          if (data.isPrivate === 0) {
            await db.event.bulkAdd(toDB);
            const revision = Number(localStorage.getItem("revision")) + 1;
            localStorage.setItem("revision", String(revision));
            setEventFlag(flag);
          } else {
            await db.private.bulkAdd(toDB);
            setPrivateFlag(pflag);
          }
        } else {
          const toDB = {
            id: res.data.data[0],
            amount: Number(data.amount1),
            category: data.category1,
            store: data.storeName,
            date: String(data.date),
          };
          if (data.isPrivate === 0) {
            const revision = Number(localStorage.getItem("revision")) + 1;
            localStorage.setItem("revision", String(revision));
            await db.event.add(toDB);
            setEventFlag(flag);
          } else {
            await db.private.add(toDB);
            setPrivateFlag(pflag);
          }
        }
        alert("登録しました");
        reset();
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
    setAmount2(0);
    setAddedAmount(0);
  };

  // フォームの表示更新
  const handleAmount2Change = (e: any) => {
    setAmount2(e.target.value);
  };

  // カテゴリー2用の支出を計算
  const addAmount = () => {
    const result = Number(amount2) + Number(addedAmount);
    setAddedAmount(result);
  };
  const minusAmount = () => {
    const result = Number(addedAmount) - Number(amount2);
    if (result <= 0) {
      setAddedAmount(0);
    } else {
      setAddedAmount(result);
    }
  };
  return (
    <div className={styles.container}>
      <h2>家計簿入力</h2>
      <ThemeProvider theme={theme}>
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
            {hasPattern ? (
              <Button
                sx={{ display: "block", marginLeft: "20px" }}
                onClick={() => {
                  setModalFlag(true);
                }}
              >
                お気に入りから選択
              </Button>
            ) : (
              <span></span>
            )}
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
              id="memo1"
              label="メモ"
              multiline
              rows={3}
              error={Boolean(errors.memo1)}
              helperText={errors.memo1?.message}
              {...register("memo1", { maxLength: { value: 100, message: "100文字以内で入力してください" } })}
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
            <Controller
              name="isPrivate"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <FormControl sx={{ width: "90%", textAlign: "left" }}>
                  <InputLabel id="isPrivate-label">登録先の家計簿</InputLabel>
                  <Select {...field} id="isPrivate" label="登録先の家計簿" labelId="isPrivate-label">
                    <MenuItem value={0}>共有</MenuItem>
                    <MenuItem value={1}>プライベート</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {display && (
            <div className={styles.additionalForm}>
              <Box sx={{ margin: "0 20px" }}>
                <div className={styles.form}>
                  <Box sx={{ display: "flex" }}>
                    <TextField id="amount2" label="追加の金額" value={amount2} onChange={handleAmount2Change} type="number" sx={{ width: "65%" }} />
                    <Box>
                      <IconButton
                        sx={{ padding: "10px 0", marginLeft: "15px" }}
                        onClick={() => {
                          addAmount();
                        }}
                      >
                        <AddCircleOutlineIcon fontSize="large" />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          minusAmount();
                        }}
                      >
                        <RemoveCircleOutlineIcon fontSize="large" />
                      </IconButton>
                    </Box>
                  </Box>
                </div>
                <div>
                  <Box sx={{ textAlign: "left", width: "100%", margin: "0 auto", paddingLeft: "10px" }}>
                    <Box sx={{ marginBottom: "2px", fontSize: "0.8em" }}>現在の追加金額</Box>
                    <Box>{addedAmount}</Box>
                  </Box>
                </div>
                <div className={styles.form}>
                  <Controller
                    name="category2"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <FormControl sx={{ textAlign: "left", width: "100%" }}>
                        <InputLabel id="category2-label">追加のカテゴリー</InputLabel>
                        <Select {...field} id="category2" label="追加のカテゴリー" labelId="category2-label">
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
                <div className={styles.form}>
                  <TextField
                    id="memo2"
                    label="追加のメモ"
                    multiline
                    rows={3}
                    error={Boolean(errors.memo2)}
                    helperText={errors.memo2?.message}
                    {...register("memo2", { maxLength: { value: 100, message: "100文字以内で入力してください" } })}
                    sx={{ width: "100%" }}
                  />
                </div>
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
              </Box>
            </div>
          )}
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
      </ThemeProvider>
      {modalFlag ? (
        <div className={styles.modal}>
          <div className={styles.modalContainer}>
            <ul className={styles.modalList}>
              {patternList.map((item: Pattern) => (
                <li key={item.id} className={styles.listItem}>
                  <div className={styles.listItem}>
                    <Button
                      sx={{ marginTop: "15px" }}
                      onClick={() => {
                        setValue("storeName", item.store_name);
                        setValue("category1", item.category);
                        setModalFlag(false);
                      }}
                    >
                      <span className={styles.icon}>
                        <CategoryIcon catNum={item.category} />
                      </span>
                      {categories[item.category].name} ({item.store_name})
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => {
                setModalFlag(false);
              }}
              variant="contained"
              color="inherit"
              sx={{ position: "fixed", bottom: "35%", right: "37%" }}
            >
              キャンセル
            </Button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
