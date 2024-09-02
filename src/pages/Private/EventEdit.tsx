import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styles from '../Event/Event.module.css';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import { privateApi } from '../../api/privateApi';
import { useNavigate, useParams } from 'react-router-dom';
import { EventEditForm } from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRecoilState } from 'recoil';
import { db } from '../../db/db';
import { privateFlagAtom } from '../../recoil/PrivateAtom';

export const EventPrivateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [eventFlag, setEventFlag] = useRecoilState(privateFlagAtom);

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<EventEditForm>();

  useEffect(() => {
    // APIからイベントを取得
    const getEvent = async () => {
      try {
        if (id !== undefined) {
          const event = await privateApi.getOne(parseInt(id));
          setValue('amount', event.data.event['amount']);
          setValue('category', event.data.event['category']);
          setValue('storeName', event.data.event['store_name']);
          setValue('memo', event.data.event['memo']);
          setValue('date', event.data.event['date']);
          setCreatedAt(event.data.event['created_at']);
          setUpdatedAt(event.data.event['updated_at']);
        } else {
          alert('読み込みに失敗しました');
        }
      } catch (err: any) {
        if (err.status === 401) {
          alert('認証エラー\n再ログインしてください');
          navigate('/login');
        } else {
          alert('読み込みに失敗しました');
          console.log(err);
        }
      } finally {
        setLoading(false);
      }
    };
    getEvent();
  }, [id, navigate, setValue]);

  // 更新ボタンをクリックしたときの処理
  const onSubmit = async (data: EventEditForm) => {
    setButtonLoading(true);
    try {
      // 送信用のフォーマットへと変換
      const send = {
        amount: Number(data.amount),
        category: data.category,
        storeName: data.storeName,
        memo: data.memo,
        date: data.date,
      };

      const res = await privateApi.update(parseInt(id!), send);
      if (res.status === 200) {
        await db.private.put({
          id: Number(id),
          amount: Number(data.amount),
          category: data.category,
          store_name: data.storeName,
          date: String(data.date),
        });
        const revision = res.data.revision;
        localStorage.setItem('revision-private', String(revision));
        navigate('/calendar');
        alert('更新しました');
      } else {
        alert('更新に失敗しました');
        console.log(res);
      }
    } catch (err: any) {
      if (err.status === 401) {
        alert('認証エラー\n再ログインしてください');
        navigate('/login');
      } else {
        alert('更新に失敗しました');
        console.log(err);
      }
    } finally {
      setButtonLoading(false);
      // Recoil Selectorの再計算用
      var flag = eventFlag + 1;
      setEventFlag(flag);
    }
  };

  const onCancel = () => {
    navigate('/calendar');
  };

  // 削除ボタンをクリックしたときの処理
  const onDelete = async () => {
    const result = window.confirm('本当に削除しますか？');
    if (result) {
      setButtonLoading(true);
      try {
        const res = await privateApi.delete(parseInt(id!));
        if (res.status === 200) {
          await db.private.delete(Number(id));
          const revision = res.data.revision;
          localStorage.setItem('revision-private', String(revision));
          navigate('/calendar');
          alert('削除しました');
        } else {
          alert('削除に失敗しました');
          console.log(res);
        }
      } catch (err: any) {
        if (err.status === 401) {
          alert('認証エラー\n再ログインしてください');
          navigate('/login');
        } else {
          alert('削除に失敗しました');
          console.log(err);
        }
      } finally {
        setButtonLoading(false);
        // Recoil Selectorの再計算用
        var flag = eventFlag + 1;
        setEventFlag(flag);
      }
    }
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            // marginTop: "330px",
            alignItems: 'center',
            height: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div className={styles.container}>
            <h2>家計簿編集</h2>
            <div className={styles.delete}>
              <LoadingButton
                startIcon={<DeleteIcon />}
                onClick={onDelete}
                loading={buttonLoading}
                sx={{
                  '& .MuiButton-startIcon': { marginRight: '1px' },
                  '& .MuiSvgIcon-root': { fontSize: '17px', marginTop: '-2px' },
                  border: '2px solid red',
                  borderRadius: '4px',
                  color: 'red',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  padding: '2px',
                }}
              >
                削除
              </LoadingButton>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.form}>
                <TextField
                  id='amount'
                  label='金額'
                  defaultValue={0}
                  error={Boolean(errors.amount)}
                  {...register('amount', { required: '金額を入力してください', min: { value: 1, message: '1以上の数値を入力してください' } })}
                  type='number'
                  helperText={errors.amount?.message}
                  sx={{ width: '90%' }}
                />
              </div>
              <div className={styles.form}>
                <Controller
                  name='category'
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <FormControl sx={{ width: '90%', textAlign: 'left' }}>
                      <InputLabel id='category-label'>カテゴリー</InputLabel>
                      <Select {...field} id='category' label='カテゴリー' labelId='category-label'>
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
                  id='storeName'
                  label='店名'
                  defaultValue={' '}
                  error={Boolean(errors.storeName)}
                  helperText={errors.storeName?.message}
                  {...register('storeName', { maxLength: { value: 20, message: '20文字以内で入力してください' } })}
                  sx={{ width: '90%' }}
                />
              </div>
              <div className={styles.form}>
                <TextField
                  id='memo'
                  label='メモ'
                  multiline
                  rows={3}
                  error={Boolean(errors.memo)}
                  helperText={errors.memo?.message}
                  {...register('memo', { maxLength: { value: 100, message: '100文字以内で入力してください' } })}
                  sx={{ width: '90%' }}
                />
              </div>
              <div className={styles.form}>
                <TextField
                  id='date'
                  label='日付'
                  type='date'
                  defaultValue={new Date().toISOString().substr(0, 10)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    style: { paddingRight: '0px' },
                  }}
                  error={Boolean(errors.date)}
                  helperText={errors.date?.message}
                  {...register('date', { required: '日付を入力してください' })}
                  sx={{ width: '90%' }}
                />
              </div>
              <div className={styles.form}>
                <LoadingButton
                  type='submit'
                  variant='contained'
                  loading={buttonLoading}
                  color='info'
                  sx={{ width: '90%', height: '45px', fontSize: '16px', fontWeight: 'bold' }}
                >
                  更新
                </LoadingButton>
              </div>
              <div className={styles.form}>
                <Button
                  onClick={onCancel}
                  variant='contained'
                  color='inherit'
                  sx={{ width: '90%', height: '45px', fontSize: '16px', fontWeight: 'bold' }}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </div>
          <div className={styles.desc}>
            <div>作成: {createdAt}</div>
            <div>更新: {updatedAt}</div>
          </div>
        </>
      )}
    </>
  );
};
