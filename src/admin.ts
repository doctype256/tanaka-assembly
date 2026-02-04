// lib/firebase/admin.ts
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const auth = admin.auth();

export async function getAllUsers() {
  const list = await auth.listUsers();
  return list.users.map((u) => ({
    uid: u.uid,
    email: u.email,
  }));
}
