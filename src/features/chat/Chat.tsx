import React, { useEffect, useRef, useState } from "react";
import { Button, Paper, Text, Box, TextInput } from "@mantine/core";
import styles from "./Chat.module.css";
import { useNavigate } from "react-router-dom";

interface ChatProps {
  room: string;
  username: string;
}

interface Message {
  username: string;
  text: string;
}

const Chat: React.FC<ChatProps> = ({ room, username }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_API_WS_URL}/${room}`)
    // const ws = new WebSocket(`ws://localhost:3000?room=${room}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`🔌 Connected to room "${room}"`);
    };

    ws.onmessage = (event) => {
      try {
        const data: Message = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (e) {
        console.warn("Invalid message", e);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    ws.onclose = () => {
      console.log(`🔌 Disconnected from room "${room}"`);
    };

    return () => ws.close();
  }, [room]);

  useEffect(() => {
    // Auto scroll to bottom
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg: Message = {
      username,
      text: input.trim(),
    };

    wsRef.current?.send(JSON.stringify(msg));
    setInput("");
  };

  return (
    <Box maw={600} mx="auto" mt="md">
      <Paper shadow="md" p="md" radius="md" withBorder>
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
            const isMine = msg.username === username;
            return (
              <div key={i} className={`${styles.message} ${isMine ? styles.mine : styles.other}`}>
                {!isMine && (
                  <Text size="xs" c="dimmed">
                    {msg.username}
                  </Text>
                )}
                <Text>{msg.text}</Text>
              </div>
            );
          })}
        </Box>

        <Box mt="md" style={{ display: "flex", gap: "0.5rem" }}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Type your message"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
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
