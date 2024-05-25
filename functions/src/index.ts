import * as admin from 'firebase-admin';

admin.initializeApp();

export { default as onUserCreate } from './user-functions/onUserCreate';
export { default as onUserDelete } from './user-functions/onUserDelete';
export { default as joinGame } from './game-functions/joinGame';
export { default as sendGameInvites } from './game-functions/sendGameInvites';
export { default as startGame } from './game-functions/startGame';
export { default as editGamePlayer } from './game-functions/editGamePlayer';
export { default as onNewNextTurn } from './game-functions/onNewNextTurn';
