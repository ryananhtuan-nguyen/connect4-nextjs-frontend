'use client';
import { BoardItem, initialBoard } from '@/utils/constants';
import { cn } from '@/utils/tw';
import { useEffect, useMemo, useState } from 'react';
import { useSocket } from '@/hook/useSocket';

export default function Home() {
  //connect to sv
  const { socket } = useSocket();

  const [board, setBoard] = useState<BoardItem[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [currentTurn, setCurrentTurn] = useState('');

  const handleOnClick = (tileId: string, value: string) => {
    if (value !== '' || currentPlayer !== currentTurn) return;
    const [rowId, colId] = tileId.split(' ').map(Number);
    let newBoard: BoardItem[][] = [...board];
    newBoard[rowId][colId].value = currentPlayer;
    setBoard(newBoard);
    socket.emit('finish-turn', {
      currentPlayer: currentPlayer,
      data: newBoard,
    });
  };
  return (
    <main>
      <div className="flex items-center justify-center flex-col h-full w-full">
        <h1 className="text-center font-bold text-3xl">Hello World</h1>
        <div className="flex gap-4 flex-col items-center justify-center">
          <h2>Pick a color</h2>
          {currentPlayer == '' ? (
            <div className="flex flex-row gap-4">
              <button
                onClick={() => {
                  socket.emit('player-connected', 'X');
                  setCurrentPlayer('X');
                }}
              >
                Black
              </button>
              <button
                onClick={() => {
                  socket.emit('player-connected', 'O');
                  setCurrentPlayer('O');
                }}
              >
                Red
              </button>
            </div>
          ) : (
            <h2>{currentPlayer}</h2>
          )}
        </div>
        <div className="h-[660px] w-[770px] border-[10px] flex border-blue-200 bg-blue-300 justify-center items-center">
          {board.map((rows, idx) => (
            <div key={idx}>
              {rows.map((col) => (
                <div
                  key={col.id}
                  className={cn(
                    'h-[90px] w-[90px] bg-white rounded-full m-2 flex item-center justify-center cursor-pointer',
                    {
                      'bg-black': col.value == 'X',
                      'bg-red-500': col.value == 'O',
                    }
                  )}
                  onClick={() => handleOnClick(col.id, col.value)}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
