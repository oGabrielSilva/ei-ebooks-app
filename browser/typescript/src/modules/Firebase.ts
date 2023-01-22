import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import firebaseConfig from '../json/firebase.json';

export default class Firebase {
  private app: FirebaseApp;
  private auth: Auth;

  private constructor() {
    this.app = getApps().length >= 1 ? getApp() : initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
  }

  public getAuth() {
    return this.auth;
  }

  public signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email.trim(), password.trim());
  }

  public signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(
      this.auth,
      email.trim(),
      password.trim()
    );
  }

  public static getModule() {
    return new Firebase();
  }
}
