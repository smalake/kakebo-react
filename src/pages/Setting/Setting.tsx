import React, { useEffect } from 'react';
import styles from './Setting.module.css';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../../db/db';
import { useRecoilValue } from 'recoil';
import { parentFlagAtom } from '../../recoil/ParentFlagAtom';
import { auth } from '../../components/util/firebase';

export const Setting = () => {
  const navigate = useNavigate();
  const isParent = useRecoilValue(parentFlagAtom);

  useEffect(() => {
    // グループの親かどうかチェック
    const checkParent = async () => {
      if (isParent === 401) {
        alert('ログインしてください');
        navigate('/login');
      }
    };
    checkParent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clickLogout = async () => {
    const res = window.confirm('ログアウトしてもよろしいですか？');
    if (res) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('revision');
        localStorage.removeItem('revision-private');
        // localStorage.removeItem("refresh");
        auth.signOut();
        await db.delete();
        alert('ログアウトしました');
        navigate('/login');
      } catch (err) {
        console.log(err);
        alert('ログアウトに失敗しました');
      }
    }
  };
  return (
    <div className={styles.container}>
      {isParent === -1 ? (
        <div>エラーが発生しました</div>
      ) : (
        <div>
          <h2>設定</h2>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant='contained'
              sx={{ fontSize: '18px', width: '80%', marginBottom: '30px' }}
              onClick={() => {
                navigate('/change-name');
              }}
            >
              表示名の変更
            </Button>
            <Button
              variant='contained'
              sx={{ fontSize: '18px', width: '80%', marginBottom: '30px' }}
              onClick={() => {
                navigate('/pattern-setting');
              }}
            >
              お気に入りの登録・編集
            </Button>
            {isParent === 1 ? (
              <Button
                variant='contained'
                sx={{
                  fontSize: '18px',
                  width: '80%',
                  marginBottom: '30px',
                }}
                onClick={() => {
                  navigate('/invite-group');
                }}
              >
                共有家計簿への招待
              </Button>
            ) : (
              <></>
            )}
            <Button
              variant='contained'
              sx={{ fontSize: '18px', width: '80%', marginBottom: '30px' }}
              onClick={() => {
                navigate('/contact');
              }}
            >
              お問い合わせ
            </Button>
            <Button variant='contained' sx={{ fontSize: '18px', width: '80%' }} onClick={clickLogout}>
              ログアウト
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
};
