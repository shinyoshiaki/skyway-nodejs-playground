import {
  LocalAudioStream,
  MediaStreamTrack,
  SkyWayContext,
  SkyWayRoom,
} from "@shinyoshiaki/skyway-nodejs-sdk";
import { testTokenString } from "./const";
import { Audio2Rtp } from "audio2rtp";
import { VoicevoxClient } from "@shinyoshiaki/voicevox-client";

const voice = new VoicevoxClient();

(async () => {
  const rtpSource = await Audio2Rtp.Create();

  const context = await SkyWayContext.Create(testTokenString);
  const room = await SkyWayRoom.Create(context, {
    type: "sfu",
  });
  console.log("roomId", room.id);
  const sender = await room.join();

  const track = new MediaStreamTrack({ kind: "audio" });
  rtpSource.onRtp.subscribe((rtp) => {
    track.writeRtp(rtp);
  });

  const stream = new LocalAudioStream(track);
  await sender.publish(stream, {
    codecCapabilities: [{ mimeType: "audio/opus" }],
  });

  for (;;) {
    const res = await voice.speak("テキストを読み上げ中");
    await rtpSource.inputWav(res);

    await new Promise((r) => setTimeout(r, 2000));
  }
})();
