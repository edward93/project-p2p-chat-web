import React, { useState } from "react";
import { TextInput, Button, Title, Group, Stack, Container, Notification } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";

import styles from "./RoomForm.module.css";

interface RoomFormProps {
  onJoin: (room: string, username: string) => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ onJoin }) => {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  const handleJoin = () => {
    if (!roomName.trim()) {
      setError("Room name is required");
      return;
    }

    setError(null);
    onJoin(roomName.trim(), username.trim());
  };

  const handleCreate = () => {
    const newRoom = uuidv4();
    onJoin(newRoom, username.trim());
  };

  return (
    <Container size="xs" className={styles.wrapper}>
      <Stack gap="lg">
        <Title order={2}>🔐 Join or Create a Room</Title>

        <TextInput label="Username" value={username} onChange={(e) => setUsername(e.currentTarget.value)} required />
        
        <TextInput
          label="Join an existing room"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.currentTarget.value)}
        />

        {error && <Notification color="red">{error}</Notification>}

        <Group>
          <Button fullWidth onClick={handleJoin}>
            Join Room
          </Button>
          <Button fullWidth variant="outline" onClick={handleCreate}>
            Create New Room
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};

export default RoomForm;
