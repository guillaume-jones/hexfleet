import { initialProfile } from '../document-types/Profile';
import { initialScore } from '../document-types/Score';
import { initialSettings } from '../document-types/Settings';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const firestore = admin.firestore();

const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const profileDocRef = firestore.doc(`profiles/${user.uid}`);
  const settingsDocRef = firestore.doc(`settings/${user.uid}`);
  const scoreDocRef = firestore.doc(`scores/${user.uid}`);

  if (!(await profileDocRef.get()).exists) {
    await profileDocRef.set(initialProfile);
    await settingsDocRef.set(initialSettings);
    await scoreDocRef.set(initialScore);
  }

  return null;
});

export default onUserCreate;
