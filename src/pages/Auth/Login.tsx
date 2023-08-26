import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAuth0 } from "@auth0/auth0-react";

export const Login = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // APIサーバへのログイン処理
    const apiLogin = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "read:current_user",
          },
        });
        localStorage.setItem("token", token);
        const res = await authApi.login();
        console.log(res);
        if (res.status === 200) {
          navigate("/event-register");
        } else {
          console.log(res);
          alert("認証エラーが発生しました\nアカウントが登録されていない、またはパスワードが間違っています");
        }
      } catch (err) {
        console.log(err);
        alert("認証エラーが発生しました\nアカウントが登録されていない、またはパスワードが間違っています");
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
