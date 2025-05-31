import { Navigate, useLocation, useParams } from "react-router-dom";
import Chat from "../features/chat/Chat";
import { useEffect } from "react";

const ChatRoom = () => {
  const { roomId } = useParams();
  const { state } = useLocation();
  const username = state?.username;

  useEffect(() => {
    document.title = `Room: ${roomId}`;
  }, [roomId]);

  if (!roomId || !username) return <Navigate to="/" />;

  return <Chat room={roomId} username={username} />;
};

export default ChatRoom;
