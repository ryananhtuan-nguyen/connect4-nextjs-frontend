'use client';
import { cn } from '@/lib/utils';
import { BoardItem } from '@/types/types';
import React from 'react';
import { socket } from '@/hook/socket';
interface BoardProps {
  board: BoardItem[][];
}

export const Board: React.FC<BoardProps> = ({ board }) => {
  const handleClick = () => {};

  return (
    <div className="h-[660px] w-[770px] border-[10px] flex border-blue-200 bg-blue-300 justify-center items-center mt-4 mb-4">
      {board.map((rows, idx) => (
        <div key={idx}>
          {rows.map((col) => (
            <div
              onClick={handleClick}
              key={col.id}
              className={cn(
                'h-[90px] w-[90px] bg-white rounded-full m-2 flex item-center justify-center cursor-pointer',
                {
                  'bg-black': col.value == 'X',
                  'bg-red-500': col.value == 'O',
                }
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
