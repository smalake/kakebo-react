import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { authApi } from "../../api/authApi";

export const Join = () => {
  const navigate = useNavigate();
  //   const { group } = useParams();
  const group = 10;

  useEffect(() => {
    // APIサーバへのログイン処理
    const apiLogin = async () => {
      try {
        // localStorage.setItem("kakebo", token);
        const res = await authApi.join(group);
        console.log(res);
        if (res.status === 200) {
          navigate("/event-register");
        } else {
          console.log(res);
          alert("認証エラーが発生しました");
        }
      } catch (err) {
        console.log(err);
        alert("認証エラーが発生しました");
      }
    };
    apiLogin();
  }, []);

  return (
    <div>
      移動しない場合は、<Link to="/event-register">こちら</Link>
      をクリックしてください。
    </div>
  );
};
