import * as functions from 'firebase-functions';

import editGamePlayer from './editGamePlayer';
import {
  EditGamePlayerData,
  GameInviteData,
  JoinGameData,
  StartGameData,
} from './functionInputs';
import joinGame from './joinGame';
import sendGameInvites from './sendGameInvites';
import startGame from './startGame';

const httpsCallable = functions
  .runWith({ minInstances: 0, memory: '512MB' })
  .https.onCall(
    async (
      data?: Partial<
        EditGamePlayerData | GameInviteData | JoinGameData | StartGameData
      >,
      context?,
    ) => {
      if (!data) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Missing data',
        );
      }

      if ('action' in data) {
        return await editGamePlayer(data, context);
      }
      if ('fromPlayerId' in data) {
        return await sendGameInvites(data, context);
      }
      if ('shortId' in data) {
        return await joinGame(data, context);
      }
      if ('gameId' in data) {
        return await startGame(data, context);
      }
    },
  );

export default httpsCallable;
