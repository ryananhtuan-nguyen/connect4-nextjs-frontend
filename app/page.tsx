'use client';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import type { BoardItem } from '@/types/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Board } from '@/components/game-components/board';
import { socket } from '@/hook/socket';

export default function Home() {
  //getting the initial board
  const [board, setBoard] = useState<BoardItem[][]>([]);
  //Creating/joining
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  //roomname
  const [roomId, setRoomId] = useState('');
  //player
  const [currentPlayer, setCurrentPlayer] = useState('');
  //gamestate
  const [gameStarted, setGameStarted] = useState(false);

  //Entering room
  const enterRoom = () => {
    socket.emit('creating-room', { roomId });
    setCreating(false);
  };
  //Joining room
  const joinRoom = () => {
    socket.emit('request-board', { roomId });
    setJoining(false);
  };

  //Effect
  useEffect(() => {
    let initBoard: BoardItem[][];
    let roomName: string;
    //initial room
    socket.on('room-created', (roomId: string) => {
      roomName = roomId;
      setRoomId(roomId);
    });
    //initial board
    socket.on('init-board', (data: { newBoard: BoardItem[][] }) => {
      console.log('Initial board');
      initBoard = data.newBoard;
      setCurrentPlayer('X');
      setBoard(data.newBoard);
    });

    //sending current board
    socket.on('new-player-joined', () => {
      console.log('Someone joined our room');
      console.log('CURRENT BOARD', initBoard);
      console.log('CURRENT ROOM', roomName);
      socket.emit('current-board', { board: initBoard, roomId: roomName });
    });

    //receiving current board
    socket.on('your-board', ({ board }: { board: BoardItem[][] }) => {
      console.log('Board Received');
      setCurrentPlayer('O');
      setBoard(board);
    });

    return () => {
      socket.off('init-board');
      socket.off('new-player-joined');
      socket.off('your-board');
    };
  }, []);

  return (
    <main>
      <div className="flex items-center justify-center flex-col h-full w-full">
        <h1 className="text-center font-bold text-3xl pt-4">Hello World</h1>
        {!creating && !joining && board.length == 0 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button onClick={() => setCreating(true)}>Create room</Button>
            <span
              className={buttonVariants({
                variant: 'ghost',
                className: 'bg-transparent',
              })}
            >
              OR
            </span>
            <Button onClick={() => setJoining(true)}>Join a room</Button>
          </div>
        )}
        {(creating || joining) && (
          <div className="flex flex-col justify-center items-center gap-2">
            <p>Room name to {creating ? 'create' : 'join'}:</p>
            {creating ? (
              <Input
                value={roomId}
                placeholder="Enter a name / id"
                onChange={(e) => setRoomId(e.target.value)}
              />
            ) : null}
            {joining ? (
              <Input
                value={roomId}
                placeholder="Enter a name / id"
                onChange={(e) => setRoomId(e.target.value)}
              />
            ) : null}
            <Button
              onClick={creating ? enterRoom : joining ? joinRoom : () => {}}
            >
              Go
            </Button>
          </div>
        )}
        {!!roomId && board.length !== 0 && (
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-600">Room name: {roomId}</p>
            <p className="text-xs text-gray-600">Opponent: {0}</p>
            <p className="text-xs text-gray-600">
              Your color: {currentPlayer == 'X' ? 'Black' : 'Red'}
            </p>
          </div>
        )}
        {/* Game Board */}
        {board && board.length !== 0 && <Board board={board} />}
      </div>
    </main>
  );
}
