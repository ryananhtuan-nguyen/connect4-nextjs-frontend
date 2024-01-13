import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = () => {
  const socket = io('http://localhost:3001');
  useEffect(() => {
    //connect to sv
    socket.emit('client-ready');
    socket.on('client-ready1', (data: string) => {
      console.log(data);
    });

    //turns
    socket.on('next-turn', (data) => {
      console.log(data);
    });
  }, []);

  return { socket };
};
