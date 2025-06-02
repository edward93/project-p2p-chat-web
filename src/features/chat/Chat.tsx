import React, { useEffect, useState, useRef } from "react";
import { TextInput, Button, Paper, Text, Box } from "@mantine/core";
import styles from "./Chat.module.css";
import { useNavigate } from "react-router-dom";

interface ChatProps {
  room: string;
  username: string;
}

interface ChatMessage {
  user: string;
  text: string;
  timestamp: number;
  type?: string;
  count?: number; // For peer count messages
}

export const Chat: React.FC<ChatProps> = ({ room, username }) => {
  const navigate = useNavigate();

  const [peerCount, setPeerCount] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log(`WS ${import.meta.env.VITE_API_WS_URL}`);
    const ws = new WebSocket(import.meta.env.VITE_API_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", room }));
    };

    ws.onmessage = (event) => {
      const msg: ChatMessage = JSON.parse(event.data);

      if (msg.type === "peer_count") {
        setPeerCount(msg?.count ?? -1);
      } else {
        setMessages((prev) => [...prev, msg]);
      }
    };

    return () => {
      ws.close();
    };
  }, [room]);

  const sendMessage = () => {
    if (wsRef.current && message.trim()) {
      const msg: ChatMessage = {
        user: username,
        text: message.trim(),
        timestamp: Date.now(),
      };
      wsRef.current.send(JSON.stringify(msg));
      setMessage("");
    }
  };

  /**
   * Formats the timestamp of a message to a human-readable time string.
   *
   * @param timestamp - The timestamp of the message
   * @returns
   */
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Box maw={600} mx="auto" mt="md">
      <Paper shadow="md" p="md" radius="md" withBorder>
        <Text size="sm" c="dimmed" mb="sm">
          Connected peers: {peerCount}
        </Text>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            minHeight: "300px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {messages.map((msg, i) => {
            const isMine = msg.user === username;
            return (
              <div key={i} className={`${styles.message} ${isMine ? styles.mine : styles.other}`}>
                <Text size="xs" c="dimmed">
                  {isMine ? formatTime(msg.timestamp) : `${msg.user} · ${formatTime(msg.timestamp)}`}
                </Text>
                <Text>{msg.text}</Text>
              </div>
            );
          })}
        </Box>

        <Box mt="md" style={{ display: "flex", gap: "0.5rem" }}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <Button onClick={sendMessage}>Send</Button>
        </Box>

        <Button
          variant="outline"
          color="red"
          fullWidth
          mt="md"
          onClick={() => {
            wsRef.current?.close();
            navigate("/");
          }}
        >
          Leave Room
        </Button>
      </Paper>
    </Box>
  );
};

export default Chat;
