import { io } from "socket.io-client";

// Single socket instance
export const socket = io("http://localhost:4000");
