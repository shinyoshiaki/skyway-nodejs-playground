import {
  RemoteVideoStream,
  SkyWayContext,
  SkyWayRoom,
  dePacketizeRtpPackets,
} from "@shinyoshiaki/skyway-nodejs-sdk";
import { testTokenString } from "./fixture";
import Gst from "@girs/node-gst-1.0";

const gst = require("node-gtk").require("Gst", "1.0") as typeof Gst;
gst.init([]);

(async () => {
  const context = await SkyWayContext.Create(testTokenString);
  const room = await SkyWayRoom.Create(context, {
    type: "sfu",
  });
  console.log("roomId", room.id);
  const receiver = await room.join();

  room.onStreamPublished.add(async (e) => {
    const { stream: remoteStream } =
      await receiver.subscribe<RemoteVideoStream>(e.publication);

    remoteStream.track.onReceiveRtp.subscribe((rtp) => {
      const codec = dePacketizeRtpPackets("vp8", [rtp]);
      if (codec.isKeyframe) {
        console.log("keyframe");
      }
    });
  });
})();
