'use client';
import { initialBoard } from '@/utils/constants';
import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
// const socket = io('http://localhost:3001');

export default function Home() {
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');

  const handleOnClick = (tileId: string) => {
    const [rowId, colId] = tileId.split(' ');
    console.log('ROW-ID', rowId, 'COL-ID', colId);
  };
  return (
    <main>
      <div className="flex items-center justify-center flex-col h-full w-full">
        <h1 className="text-center font-bold text-3xl">Hello World</h1>
        <div className="h-[660px] w-[770px] border-[10px] flex border-blue-200 bg-blue-300 justify-center items-center">
          {board.map((rows, idx) => (
            <div key={idx}>
              {rows.map((col) => (
                <div
                  key={col.id}
                  className="h-[90px] w-[90px] bg-white rounded-full m-2 flex item-center justify-center cursor-pointer"
                  onClick={() => handleOnClick(col.id)}
                >
                  <span className="text-[60px] justify-center">
                    {col.value}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
