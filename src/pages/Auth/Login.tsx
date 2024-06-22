import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginValidation } from '../../components/util/validation';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { TextField, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import { LoginForm } from '../../../src/types';
import { authApi } from '../../api/authApi';
import { eventApi } from '../../api/eventApi';
import { db } from '../../db/db';
import { privateApi } from '../../api/privateApi';
import { useSetRecoilState } from 'recoil';
import { loginAtom } from '../../recoil/LoginAtom';
import { parentFlagAtom } from '../../recoil/ParentFlagAtom';
import { auth, provider } from '../../components/util/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { IoMdMail } from 'react-icons/io';

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const setIsLogin = useSetRecoilState(loginAtom);
  const setIsParent = useSetRecoilState(parentFlagAtom);

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginValidation) });

  // ログインチェック
  useEffect(() => {
    const loginCheck = async (count: number) => {
      try {
        if (localStorage.getItem('token')) {
          const res = await authApi.isLogin();
          console.log(res);
          if (res.status === 200) {
            setIsLogin(1);
            if (res.data.parent) {
              setIsParent(1);
            } else {
              setIsParent(0);
            }
            navigate('/event-register');
          } else if (res.status === 401) {
            // トークンの期限切れだった場合、リフレッシュトークンを使って再取得
            // 2回目の場合（countが1）は再ログイン
            if (res.data.error.includes('ID token has expired') && count === 0) {
              const token = await auth.currentUser?.getIdToken(true);
              localStorage.setItem('token', token!);
              loginCheck(1);
            }
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loginCheck(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // メールアドレスでログイン
  const onSubmit = async (data: LoginForm) => {
    setButtonLoading(true);
    await handleLogin(() => signInWithEmailAndPassword(auth, data.email, data.password));
  };

  // Googleログイン
  const googleLogin = async () => {
    setGoogleLoading(true);
    await handleLogin(() => signInWithPopup(auth, provider));
  };

  // ログイン処理
  const handleLogin = async (action: Function) => {
    try {
      const resFirebase = await action();
      const uid = resFirebase.user.uid;
      // TODO: エラーの種類に応じてメッセージを変える
      if (uid === '') {
        alert('ログインできませんでした');
        throw new Error('firebase login failed');
      }
      if (await eventSet(uid)) {
        const token = await resFirebase.user.getIdToken();
        localStorage.setItem('token', token);
        setTimeout(() => {
          navigate('/event-register');
        }, 1000);
      } else {
        alert('エラーが発生しました');
        throw new Error('event init failed');
      }
    } catch (err) {
      console.log(err);
      alert('エラーが発生しました');
    } finally {
      setButtonLoading(false);
      setGoogleLoading(false);
    }
  };

  // イベントの初期設定
  const eventSet = async (uid: string) => {
    const param = {
      uid: uid,
    };
    const res = await authApi.login(param);
    // ユーザ登録されていたらログイン
    if (res.status !== 200) {
      alert('エラーが発生しました');
      console.log(res.data.error); // TODO: エラーメッセージが取得できるか確認
      return false;
    }
    const eventData = await eventApi.getAll();
    const privateData = await privateApi.getAll();
    const revision = await eventApi.revision();
    db.open()
      .then(() => {
        db.transaction('rw', db.event, db.private, () => {
          db.event.bulkAdd(eventData.data.events);
          db.private.bulkAdd(privateData.data.events);
        }).then(() => {
          // リビジョンを保存
          localStorage.setItem('revision', revision.data.revision);
          setIsLogin(1);
          return true;
        });
      })
      .catch((error) => {
        console.log(error);
        alert('エラーが発生しました');
        return false;
      });
  };

  return (
    <div className={styles.container}>
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
          <CircularProgress size='20rem' />
        </Box>
      ) : (
        <>
          <h2>ログイン</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.form}>
              <TextField
                id='email'
                label='メールアドレス'
                {...register('email')}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                sx={{ width: '90%' }}
              />
            </div>
            <div className={styles.form}>
              <TextField
                id='password'
                label='パスワード'
                type='password'
                {...register('password')}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                sx={{ width: '90%' }}
              />
            </div>
            <div className={styles.form}>
              <LoadingButton
                type='submit'
                variant='contained'
                loading={buttonLoading}
                color='info'
                sx={{
                  width: '70%',
                  height: '45px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
                startIcon={<IoMdMail />}
              >
                メールアドレスでログイン
              </LoadingButton>
            </div>
          </form>
          <p className={styles.subText}>または</p>
          <div className={styles.form}>
            <LoadingButton
              onClick={googleLogin}
              sx={{
                width: '70%',
                height: '45px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#4c4c4c',
                borderColor: '#4c4c4c',
              }}
              variant='outlined'
              loading={googleLoading}
              startIcon={<FcGoogle />}
            >
              Googleアカウントでログイン
            </LoadingButton>
          </div>
          <div style={{ marginLeft: '20px' }}>
            <p className={styles.linkText}>アカウントをお持ちでない方は</p>
            <Link to='/register'>新規登録</Link>
          </div>
        </>
      )}
      {googleLoading ? (
        <div className={styles.modal}>
          <CircularProgress />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
