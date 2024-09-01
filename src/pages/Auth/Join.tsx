import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerValidation } from '../../components/util/validation';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Auth.module.css';
import { TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { RegisterForm } from '../../../src/types';
import { createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { auth, provider } from '../../components/util/firebase';
import { FirebaseError } from 'firebase/app';
import { FcGoogle } from 'react-icons/fc';
import { IoMdMail } from 'react-icons/io';
import { useSetRecoilState } from 'recoil';
import { parentFlagAtom } from '../../recoil/ParentFlagAtom';
import { loginAtom } from '../../recoil/LoginAtom';
import { dbRegister, eventSet } from './AuthEvent';

export const Join = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [params] = useSearchParams();
  const setIsParent = useSetRecoilState(parentFlagAtom);
  const setIsLogin = useSetRecoilState(loginAtom);
  const key = params.get('key');

  // react-hook-formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerValidation) });

  // メールアドレスで新規登録ボタンが押されたときの処理
  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
      if (res.user.uid !== '') {
        const registerData = {
          uid: res.user.uid,
          name: data.name,
          type: 1,
          key: key,
        };

        // DBに登録
        const result = await dbRegister(registerData);
        if (result) {
          // 認証メール送信
          await sendEmailVerification(res.user);
          alert('認証メールを送信しました。\nメールアドレスの認証を完了させてください。');
          navigate('/');
        } else {
          // DB登録が失敗した場合、Firebaseユーザを削除
          await res.user.delete();
          throw new Error('db register failed');
        }
      } else {
        throw new Error('Firebase register failed');
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            alert('このメールアドレスは既に使用されています。');
            break;
          case 'auth/invalid-email':
            alert('無効なメールアドレス形式です。');
            break;
          case 'auth/operation-not-allowed':
            alert('メールアドレスとパスワードによる登録が許可されていません。');
            break;
          case 'auth/weak-password':
            alert('パスワードが弱すぎます。もっと強いパスワードを設定してください。');
            break;
          default:
            alert('登録に失敗しました。');
            console.error(error);
        }
      } else {
        // 予期しないエラータイプ
        console.error('An unexpected error occurred:', error);
        alert('予期しないエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  // Googleログイン
  const googleLogin = async () => {
    setGoogleLoading(true);
    try {
      const res = await signInWithPopup(auth, provider);
      if (res.user.uid !== '') {
        const registerData = {
          uid: res.user.uid,
          name: res.user.displayName!,
          type: 2,
          key: key,
        };
        // DBに登録
        const result = await dbRegister(registerData);
        if (result) {
          const token = await res.user.getIdToken();
          localStorage.setItem('token', token);
          await eventSet();
          setIsLogin(1);
          setIsParent(0);
          navigate('/');
        } else {
          // DB登録が失敗した場合、Firebaseユーザを削除
          await res.user.delete();
          throw new Error('db register failed');
        }
      } else {
        throw new Error('Google login failed');
      }
    } catch (err) {
      alert('エラーが発生しました');
      console.log(err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>新規登録フォーム</h2>
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
            id='name'
            label='表示名'
            {...register('name')}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
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
          <TextField
            id='confirmPassword'
            label='確認用パスワード'
            type='password'
            {...register('confirmPassword')}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
            sx={{ width: '90%' }}
          />
        </div>
        <div className={styles.form}>
          <LoadingButton
            type='submit'
            variant='contained'
            loading={loading}
            color='info'
            sx={{
              width: '70%',
              height: '45px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
            startIcon={<IoMdMail />}
          >
            メールアドレスで新規登録
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
          Googleアカウントで新規登録
        </LoadingButton>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <p className={styles.linkText}>アカウントをお持ちの方は</p>
        <Link to='/login'>ログイン</Link>
      </div>
    </div>
  );
};
