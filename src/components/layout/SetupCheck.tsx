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
          const res = await setupApi.get();
          console.log(res);
          const grouoId = res.data["grouoId"];
          if (grouoId <= 0) {
            navigate("/setup");
          } else {
            setCheck((prevCheck) => ({
              ...prevCheck,
              setup: grouoId,
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
