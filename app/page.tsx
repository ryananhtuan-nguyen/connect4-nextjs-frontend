'use client';
import { Board } from '@/components/game-components/board';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { socket } from '@/hook/socket';
import type { BoardItem } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  //getting the initial board
  const [board, setBoard] = useState<BoardItem[][]>([]);
  //Creating/joining
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  //roomname
  const [roomId, setRoomId] = useState('');
  //player
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [currentInRoom, setCurrentInRoom] = useState(0);

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
    let roomName: string = '';

    //initial room
    socket.on('room-created', (roomId: string) => {
      roomName = roomId;
      setRoomId(roomId);
    });
    //initial board
    socket.on(
      'init-board',
      (data: { newBoard: BoardItem[][]; userInRoom: number }) => {
        console.log('Initial board');
        initBoard = data.newBoard;
        setCurrentPlayer('X');
        setCurrentInRoom(data.userInRoom);
        setBoard(data.newBoard);
      }
    );

    //sending current board
    socket.on('new-player-joined', ({ users }: { users: number }) => {
      console.log('someone joined');
      console.log(users);
      setCurrentInRoom(users);
      socket.emit('current-board', { board: initBoard, roomId: roomName });
    });

    //receiving current board
    socket.on(
      'your-board',
      ({ board, userInRoom }: { board: BoardItem[][]; userInRoom: number }) => {
        setCurrentInRoom(userInRoom);
        setCurrentPlayer('O');
        setBoard(board);
      }
    );

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

            <p className="text-xs text-gray-600">
              Your color: {currentPlayer == 'X' ? 'Black' : 'Red'}
            </p>
            <p className="text-xs text-gray-600">
              Current in room: {currentInRoom} players
            </p>
          </div>
        )}
        {/* Game Board */}
        {board && board.length !== 0 && (
          <Board board={board} currentPlayer={currentPlayer} roomId={roomId} />
        )}
      </div>
    </main>
  );
}
