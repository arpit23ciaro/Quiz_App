import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const socket = io(SERVER_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default socket;
