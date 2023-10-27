import {
  RemoteAudioStream,
  SkyWayContext,
  SkyWayRoom,
} from "@shinyoshiaki/skyway-nodejs-sdk";
import { testTokenString } from "./const";
import { SessionFactory } from "rtp2text";

const factory = new SessionFactory({ modelPath: __dirname + "/vosk-model" });

(async () => {
  const s2t = await factory.create();
  s2t.onText.subscribe((text) => {
    console.log(text);
  });

  const context = await SkyWayContext.Create(testTokenString);
  const room = await SkyWayRoom.Create(context, {
    type: "sfu",
  });
  console.log("roomId", room.id);
  const receiver = await room.join();

  room.onStreamPublished.add(async (e) => {
    if (e.publication.contentType !== "audio") {
      return;
    }

    const { stream: remoteStream } =
      await receiver.subscribe<RemoteAudioStream>(e.publication);

    remoteStream.track.onReceiveRtp.subscribe((rtp) => {
      s2t.inputRtp(rtp);
    });
  });
})();
