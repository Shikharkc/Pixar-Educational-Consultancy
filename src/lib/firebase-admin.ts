
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Your web app's Firebase configuration is used for client-side initialization.
// For the backend (server actions), we use the Firebase Admin SDK.

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Initialize Firebase Admin SDK (Singleton Pattern)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL is not needed for Firestore, but good practice if using RTDB
  });
}

const db = getFirestore(admin.app()); // Get default Firestore instance
// Note: When using the Admin SDK in a server environment like Next.js Server Actions or Cloud Functions,
// it often has broad access to the project's resources. Explicitly naming the database
// like `getFirestore(admin.app(), 'pixareducation')` is not the standard way and can cause issues
// if the default instance is assumed. The correct way is to use the default instance,
// and your security rules will manage access. The client-side config correctly points to the DB.

export { admin, db };
