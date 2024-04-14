import { BoardState, Player } from '../document-types/Games';

export const updatePlayerStatus = (
  boardState: BoardState,
  players: Player[],
): Player[] => {
  const aliveHomeworlds = boardState
    .filter((tile) => tile.homeworld)
    .map((tile) => tile.playerId);

  return players.map((player) => {
    const playerHasLostHomeworld = !aliveHomeworlds.includes(player.id);

    return {
      ...player,
      dead: player.dead || playerHasLostHomeworld,
      sent: false,
    };
  });
};
