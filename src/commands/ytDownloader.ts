import { createWriteStream } from "fs";
import { nanoid } from "nanoid";
import Innertube from "youtubei.js";
import ytdl from "ytdl-core";
import ff from "fluent-ffmpeg";
import BetterMessage from "../classes/BetterMessage";
import { proto } from "@adiwajshing/baileys";
const IT = require("youtubei.js");
export default async function ytDownloader(m: BetterMessage, arg: string[]) {
  const filename = `./media/${nanoid()}`;
  const youtube = await new IT()
  if (!(arg[0] === "video" || arg[0] === "audio")) {
    m.reply("Debes especificar si quieres descargar un video o audio");
    return;
  }
  if (!ytdl.validateURL(arg[1])) {
    m.reply("URL invalida");
    return;
  }
  const stream = youtube.download(ytdl.getVideoID(arg[1]), {
    quality: "360p",
    format: "mp4",
  });
  stream.pipe(createWriteStream(filename + ".mp4"));

  stream.on("start", () => {
    m.reply("Descargando...");
  });

  stream.on("end", async () => {
    if (arg[0] === "audio") {
      await new Promise((resolve, reject) => {
        ff(filename + ".mp4")
        .on("error", reject)
        .on("end", () => resolve(true))
        .addOutputOptions(["-b:a", "192K", "-vn"])
        .toFormat("mp3")
        .save(filename + ".mp3");
      });
    }
    arg[0] === "audio" ? m.sendAudio(m.getChatSender()!,filename+".mp3") : m.sendVideo(m.getChatSender()!, filename+".mp4");
  });
}
