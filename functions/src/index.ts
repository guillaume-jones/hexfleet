import * as admin from 'firebase-admin';

admin.initializeApp();

export { default as onUserCreate } from './user-functions/onUserCreate';
export { default as onUserDelete } from './user-functions/onUserDelete';
export { default as httpsCallable } from './game-functions/httpsCallable';
export { default as onNewNextTurn } from './game-functions/onNewNextTurn';
