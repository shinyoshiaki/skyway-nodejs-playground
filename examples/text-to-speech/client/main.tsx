import React, { FC, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { RemoteAudioStream, SkyWayContext, SkyWayRoom } from "@skyway-sdk/room";
import { testTokenString } from "./const";

const App: FC = () => {
  const [roomId, setRoomId] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const audio = audioRef.current!;

  const start = async () => {
    const context = await SkyWayContext.Create(testTokenString);
    const room = await SkyWayRoom.Find(context, { id: roomId }, "sfu");
    const member = await room.join();
    const publication = room.publications.find(
      (p) => p.contentType === "audio"
    )!;
    const { stream } = await member.subscribe<RemoteAudioStream>(publication);
    stream.attach(audio);
  };

  return (
    <div>
      <input placeholder="roomId" onChange={(e) => setRoomId(e.target.value)} />
      <button onClick={start}>start</button>
      <audio autoPlay controls ref={audioRef} />
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
