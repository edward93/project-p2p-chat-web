import Home from "./routes/Home";
import ChatRoom from "./routes/ChatRoom";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<ChatRoom />} />
    </Routes>
  );
};

export default App;
