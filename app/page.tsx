'use client';
import { BoardItem, initialBoard } from '@/utils/constants';
import { cn } from '@/utils/tw';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3001');

export default function Home() {
  //connect to sv

  const [board, setBoard] = useState<BoardItem[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [currentTurn, setCurrentTurn] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joining, setJoining] = useState(false);
  const [opponent, setOpponent] = useState(0);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('room-created', (id: string) => {
      setRoomId(id);
    });

    return () => {
      socket.off('room-created');
    };
  }, []);

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

  const createRoom = (player: string) => {
    console.log(player);
    socket.emit('creating-room', player);
  };
  return (
    <main>
      <div className="flex items-center justify-center flex-col h-full w-full">
        <h1 className="text-center font-bold text-3xl">Hello World</h1>

        {/* Pick turn or join room */}
        {roomId == '' ? (
          <div className="flex gap-6 flex-col items-center justify-center">
            <h2>Pick one to create room</h2>
            <div className="flex gap-8 pb-8">
              <button
                className="border-2 bg-black text-white rounded-md px-2"
                onClick={() => createRoom('X')}
              >
                Black
              </button>
              <button
                className="border-2 bg-red-500 text-white rounded-md px-5"
                onClick={() => createRoom('O')}
              >
                {' '}
                Red
              </button>
            </div>
            {!joining ? (
              <>
                <p>OR</p>
                <button
                  className="border-2 border-black bg-gray-600 text-white rounded-md px-4"
                  onClick={() => setJoining(true)}
                >
                  Join a Room
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  onClick={() => {
                    socket.emit('join-room', input);
                  }}
                >
                  Go
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center gap-10 w-full">
            <h2>Current room Id: {roomId}</h2>
            <h2>Opponent: {opponent}</h2>
          </div>
        )}

        {/* Game Board */}
        <div className="h-[660px] w-[770px] border-[10px] flex border-blue-200 bg-blue-300 justify-center items-center mt-4 mb-4">
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
