import Head from 'next/head';
import { useEffect, useState } from 'react';

import { BoardState } from 'functions/src/document-types/Games';
import { defaultPlayer } from 'functions/src/game-logic/GameConstants';
import { addBordersToBoard } from 'functions/src/game-logic/addBordersToBoard';
import { addPlayersToBoard } from 'functions/src/game-logic/addPlayersToBoard';
import { getPlayersInfluence } from 'functions/src/game-logic/influenceUtils';

import { aiId, campaignMaps, playerId } from 'src/campaign/campaign-maps';
import Range from 'src/components/interactive/Range';
import ClickableBoard from 'src/game/board/ClickableBoard';
import SimpleHexBoard from 'src/game/board/SimpleHexBoard';
import { generateBoard } from 'src/game/board/generateBoard';

const playerIds = [aiId, playerId];
const players = playerIds.map((id) => ({ ...defaultPlayer, id }));
const initialBoardSize = 9;

export default function AiTraining() {
  const [boardSize, setBoardSize] = useState(initialBoardSize);
  const [boardState, setBoardState] = useState<BoardState>(
    addPlayersToBoard({
      boardState: generateBoard({ boardSize: initialBoardSize }),
      boardSize: initialBoardSize,
      players,
    }),
  );

  const influenceByPlayer = getPlayersInfluence(
    addBordersToBoard(boardState, boardSize),
  );

  useEffect(() => {
    console.info(boardState);
  }, [boardState]);

  return (
    <>
      <Head>
        <title>HexFleet - Map Editor</title>
      </Head>
      <div className="mx-12 mt-8 flex flex-1 flex-col gap-4">
        <h1 className={'text-3xl font-semibold text-zinc-50'}>Map Editor</h1>
        <div className="flex gap-6">
          <div className="flex w-20 flex-col">
            <p className="font-semibold">Influence</p>
            <div className="flex justify-between">
              <p>AI:</p>
              <p>{influenceByPlayer[aiId]}</p>
            </div>
            <div className="flex justify-between">
              <p>Player:</p>
              <p>{influenceByPlayer[playerId]}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <p className="font-semibold">Board Size:</p>

              <p>{boardSize}</p>
            </div>
            <Range
              value={boardSize}
              setValue={setBoardSize}
              onChange={(newSize) =>
                setBoardState(
                  addPlayersToBoard({
                    boardState: generateBoard({ boardSize: newSize }),
                    boardSize: newSize,
                    players,
                  }),
                )
              }
              min={5}
              max={15}
            />
          </div>
          <p className="font-semibold">Load Map:</p>
          <div className="flex flex-1 flex-row gap-2 overflow-x-scroll">
            {campaignMaps.map((map) => {
              const withBorders = addBordersToBoard(
                map.boardState,
                map.boardSize,
              );

              return (
                <div
                  key={map.id}
                  className="flex max-h-44 w-32 min-w-32 cursor-pointer flex-col items-center gap-2 rounded-md bg-zinc-900 p-2 transition-all duration-200 hover:bg-zinc-800 active:bg-zinc-900"
                  onClick={() => {
                    setBoardState(map.boardState), setBoardSize(map.boardSize);
                  }}>
                  <p className="text-sm font-semibold">{map.title}</p>
                  <SimpleHexBoard
                    board={withBorders}
                    boardSize={map.boardSize}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex max-w-xl flex-1">
          <ClickableBoard
            boardSize={boardSize}
            boardState={boardState}
            setBoardState={setBoardState}
            playerIds={playerIds}
            shouldConsoleOnClick
          />
        </div>
      </div>
    </>
  );
}
