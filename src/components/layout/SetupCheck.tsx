import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { setupApi } from "../../api/setupApi";
import { useRecoilState } from "recoil";
import { checkAtom } from "../../recoil/CheckAtom";

export const SetupCheck = () => {
  const navigate = useNavigate();
  const [check, setCheck] = useRecoilState(checkAtom);
  useEffect(() => {
    const checkSetup = async () => {
      // セットアップが完了しているかチェック
      if (check.setup === 0) {
        try {
          // グループ情報を取得
          const res = await setupApi.get();
          const groupId = Number(res.data["groupId"]);
          // グループIDが0以下の場合はセットアップ未完了（未完了の場合は0か-1が返ってくる）
          if (groupId <= 0) {
            // セットアップ画面へ
            navigate("/setup");
          } else {
            // セットアップ完了していた場合はAtomへ登録
            setCheck((prevCheck) => ({
              ...prevCheck,
              setup: groupId,
            }));
          }
        } catch (err: any) {
          if (err.status === 401) {
            alert("認証エラー\n再ログインしてください");
            navigate("/login");
          } else {
            alert("更新に失敗しました");
            console.log(err);
          }
        }
      }
    };
    checkSetup();
  });
  return <Outlet />;
};
