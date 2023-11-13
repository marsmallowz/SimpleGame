import React, {createContext, useState, useEffect, ReactNode} from 'react';
import io, {Socket} from 'socket.io-client';
import {AppState} from '../redux/slices';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';

interface SocketContextProps {
  children: ReactNode;
}

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
});

const SocketProvider: React.FC<SocketContextProps> = ({children}) => {
  const auth = useSelector((state: AppState) => state.auth);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(`${Config.API_URL}/areas`, {
      extraHeaders: {
        userid: auth.userId!,
        auth: auth.token!,
      },
    });
    // akan menerima saat server tiba2 off
    socketInstance.on('disconnect', () => {
      console.log('Disconnect dari server');
    });
    setSocket(socketInstance);
    return () => {
      console.log('Disconnect');
      // mengirimkan pesan client ingin disconnect
      socketInstance.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  );
};

export {SocketProvider, SocketContext};
