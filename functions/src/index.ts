import * as admin from 'firebase-admin';

admin.initializeApp();

export { default as onUserCreate } from './user/onUserCreate';
export { default as onUserDelete } from './user/onUserDelete';
export { default as joinGame } from './game/joinGame';
