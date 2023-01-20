import { credential, ServiceAccount } from 'firebase-admin';
import { initializeApp as initializeAdminApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  getStorage,
  FirebaseStorage,
  ref,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';
import firebase from '../json/firebase.json';

export default class FirebaseService {
  private readonly adminApp: App;
  private readonly adminAuth: Auth;
  private readonly firestore: Firestore;
  private readonly app: FirebaseApp;
  private readonly storage: FirebaseStorage;

  public constructor() {
    const { adminServiceAccount } = firebase;
    this.adminApp = initializeAdminApp({
      credential: credential.cert(adminServiceAccount as ServiceAccount),
    });
    this.adminAuth = getAuth(this.adminApp);
    this.app = initializeApp(firebase.serverFirebaseConfig);
    this.firestore = getFirestore(this.adminApp);
    this.storage = getStorage(this.app);
  }

  public getAuth() {
    return this.adminAuth;
  }

  public getFirestore() {
    return this.firestore;
  }

  public getStorage() {
    return this.storage;
  }

  public async uploadString(id: string, path: string, data: string) {
    const storageRef = ref(this.getStorage(), path.concat(id));
    await uploadString(storageRef, data, 'data_url');
    return await getDownloadURL(storageRef);
  }
}
