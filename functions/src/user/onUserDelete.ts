import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const firestore = admin.firestore();

const onUserDelete = functions.auth.user().onDelete(async (user) => {
  await firestore.doc(`settings/${user.uid}`).delete();
  return null;
});

export default onUserDelete;
