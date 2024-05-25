import { Invites } from '../document-types/Invites';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { GameInviteData } from './functionInputs';

const firestore = admin.firestore();

const sendGameInvites = functions
  .runWith({ minInstances: 0, memory: '512MB' })
  .https.onCall(async (data?: Partial<GameInviteData>, context?) => {
    if (!data) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing data');
    }

    const playerId = context?.auth?.uid;
    if (!playerId) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Not an authenticated user',
      );
    }

    const { shortId, toPlayerIds, fromPlayerId } = data;

    if (!shortId || !toPlayerIds || !fromPlayerId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing shortId, toPlayerId, or fromPlayerId',
      );
    }

    const newInvite = {
      expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 86400000),
      fromPlayerId,
      shortId,
    };

    const inviteUpdates = toPlayerIds.map(async (toPlayerId) => {
      const invitesRef = firestore.doc(`invites/${toPlayerId}`);
      const invitesDoc = await invitesRef.get();

      if (!invitesDoc.exists) {
        return invitesRef.create({ gameInvites: [newInvite] });
      }

      // Filter out expired game invites
      const inviteData = invitesDoc.data() as Invites;
      const validInvites = inviteData.gameInvites.filter(
        (invite) => invite.expiresAt.toMillis() > Date.now(),
      );

      return invitesRef.update({ gameInvites: [...validInvites, newInvite] });
    });

    await Promise.all(inviteUpdates);
  });

export default sendGameInvites;
