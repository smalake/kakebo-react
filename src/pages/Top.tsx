import styles from "./Auth/Auth.module.css";
import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

export const Top = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className={styles.container}>
      <h2>使いやすい家計簿</h2>
      <div className={styles.form}>
        <Button
          variant="contained"
          color="info"
          sx={{
            width: "90%",
            height: "45px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
          onClick={() => loginWithRedirect()}
        >
          ログイン/新規登録
        </Button>
      </div>
    </div>
  );
};
