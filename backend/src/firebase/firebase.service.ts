import { Injectable } from '@nestjs/common';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

import serviceAccount from '../../firebase/serviceAccountKey.json';

@Injectable()
export class FirebaseService {
  private firestore: Firestore;
  private auth: Auth;

  constructor() {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert(serviceAccount as any),
      });
    }

    this.firestore = getFirestore();
    this.auth = getAuth();
  }

  getFirestore(): Firestore {
    return this.firestore;
  }

  getAuth(): Auth {
    return this.auth;
  }
}