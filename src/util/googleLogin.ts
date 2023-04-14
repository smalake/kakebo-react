import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

// Googleアカウントでログインを行う
export const googleLogin = async () => {
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(userCredential);
    const uid = userCredential.user.uid;
    const name = userCredential.user.displayName;
    const token = credential?.accessToken;
    return { uid, token, name };
  } catch (err) {
    throw err;
  }
};
