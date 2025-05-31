import { useNavigate } from "react-router-dom";
import RoomForm from "../features/room/RoomForm";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Join or Create a Room";
  }, []);

  const handleJoin = (room: string, username: string) => {
    navigate(`/room/${room}`, { state: { username } });
  };

  return <RoomForm onJoin={handleJoin} />;
};

export default Home;
