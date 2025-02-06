import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const socket = io(SERVER_URL, {
  transports: ["polling"],
  withCredentials: true,
  autoConnect: false, 
  reconnection: true, 
  reconnectionAttempts: 3, 
});

export default socket;
