import React, { FC, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
} from "@skyway-sdk/room";
import { testTokenString } from "./const";

const App: FC = () => {
  const [roomId, setRoomId] = useState("");

  const start = async () => {
    const context = await SkyWayContext.Create(testTokenString);
    const room = await SkyWayRoom.Find(context, { id: roomId }, "sfu");
    const member = await room.join();
    const stream = await SkyWayStreamFactory.createMicrophoneAudioStream();
    await member.publish(stream);
  };

  return (
    <div>
      <input placeholder="roomId" onChange={(e) => setRoomId(e.target.value)} />
      <button onClick={start}>start</button>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
