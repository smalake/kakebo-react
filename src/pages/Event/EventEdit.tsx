import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styles from './Event.module.css';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import { eventApi } from '../../api/eventApi';
import { useNavigate, useParams } from 'react-router-dom';
import { EventEditForm } from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import { eventFlagAtom } from '../../recoil/EventAtom';
import { useRecoilState } from 'recoil';
import { db } from '../../db/db';

export const EventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [createUser, setCreateUser] = useState('');
  const [updateUser, setUpdateUser] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [eventFlag, setEventFlag] = useRecoilState(eventFlagAtom);

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
          const event = await eventApi.getOne(parseInt(id));
          const formatedDate = event.data['date'].split('T');
          setValue('amount', event.data['amount']);
          setValue('category', event.data['category']);
          setValue('storeName', event.data['store_name']);
          setValue('memo', event.data['memo']);
          setValue('date', formatedDate[0]);
          setCreateUser(event.data['create_user']);
          setCreatedAt(event.data['created_at']);
          setUpdateUser(event.data['update_user']);
          setUpdatedAt(event.data['updated_at']);
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
    const d = new Date(data.date);
    try {
      // 送信用のフォーマットへと変換
      const send = {
        amount: Number(data.amount),
        category: data.category,
        store_name: data.storeName,
        memo: data.memo,
        date: d.toISOString(),
      };

      const res = await eventApi.update(parseInt(id!), send);
      if (res.status === 200) {
        await db.event.put({
          id: Number(id),
          amount: Number(data.amount),
          category: data.category,
          store_name: data.storeName,
          date: String(data.date),
        });
        // Recoil Selectorの再計算用
        var flag = eventFlag + 1;
        setEventFlag(flag);
        const revision = Number(localStorage.getItem('revision')) + 1;
        localStorage.setItem('revision', String(revision));
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
        const res = await eventApi.delete(parseInt(id!));
        if (res.status === 200) {
          await db.event.delete(Number(id));
          const revision = Number(localStorage.getItem('revision')) + 1;
          localStorage.setItem('revision', String(revision));
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
            <div>
              作成: {createUser}さん ({createdAt})
            </div>
            <div>
              更新: {updateUser}さん ({updatedAt})
            </div>
          </div>
        </>
      )}
    </>
  );
};
