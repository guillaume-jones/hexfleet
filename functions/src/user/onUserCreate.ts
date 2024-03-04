import { initialSettings } from '../document-types/Settings';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const firestore = admin.firestore();

const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const settingsDocRef = firestore.doc(`settings/${user.uid}`);
  if (!(await settingsDocRef.get()).exists) {
    await settingsDocRef.set(initialSettings);
  }

  return null;
});

export default onUserCreate;
