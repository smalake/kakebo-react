import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

// Googleアカウントでログインを行う
export const googleLogin = async () => {
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const token = await userCredential.user.getIdToken();
    const uid = userCredential.user.uid;
    const name = userCredential.user.displayName;
    return { uid, token, name };
  } catch (err) {
    throw err;
  }
};
