'use client';
import { cn } from '@/lib/utils';
import { BoardItem } from '@/types/types';
import React, { useEffect, useState } from 'react';
import { socket } from '@/hook/socket';
import { Dialog, DialogContent } from '../ui/dialog';
interface BoardProps {
  board: BoardItem[][];
  currentPlayer: string;
  roomId: string;
}

export const Board: React.FC<BoardProps> = ({
  board,
  currentPlayer,
  roomId,
}) => {
  //game state
  const [currentBoard, setCurrentBoard] = useState(board);
  const [turn, setTurn] = useState('X');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');

  const handleClick = (id: string, value: string) => {
    if (currentPlayer !== turn || value !== '') return;
    const [x, y] = id.split(' ').map(Number);
    console.log(x, y);
    let newBoard = [...currentBoard];
    newBoard[x][y].value = currentPlayer;
    setCurrentBoard(newBoard);
    setTurn('');
    socket.emit('finished-turn', {
      currentPlayer,
      newBoard,
      recentMove: [x, y],
      roomId,
    });
  };

  useEffect(() => {
    socket.on(
      'next-turn',
      ({
        turn,
        currentBoard,
      }: {
        turn: string;
        currentBoard: BoardItem[][];
      }) => {
        setTurn(turn);
        setCurrentBoard(currentBoard);
      }
    );

    socket.on('game-end', ({ winner }: { winner: string }) => {
      setWinner(winner);
      setGameOver(true);
    });

    socket.on('clear-game', () => {
      setGameOver(false);
      setTurn(winner == 'X' ? 'O' : 'X');
      const newBoard = currentBoard.map((row) =>
        row.map((col) => ({ ...col, value: '' }))
      );
      setCurrentBoard(newBoard);
    });

    return () => {
      socket.off('next-turn');
      socket.off('game-end');
      socket.off('clear-game');
    };
  }, []);
  return (
    <div className="h-[660px] w-[770px] border-[10px] flex border-blue-200 bg-blue-300 justify-center items-center mt-4 mb-4">
      <Dialog
        open={gameOver}
        onOpenChange={() => {
          socket.emit('clear', roomId);
          setGameOver(false);
        }}
      >
        <DialogContent>
          <div className="flex flex-col items-center justify-center">
            Game has ended. {winner == currentPlayer ? 'You won' : 'You lose'}
          </div>
        </DialogContent>
      </Dialog>
      {currentBoard.map((rows, idx) => (
        <div key={idx}>
          {rows.map((col) => (
            <div
              onClick={() => handleClick(col.id, col.value)}
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
