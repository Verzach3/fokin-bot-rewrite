import { createWriteStream } from "fs";
import { nanoid } from "nanoid";
import ytdl from "ytdl-core";
import ff from "fluent-ffmpeg";
import BetterMessage from "../classes/BetterMessage";
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
  let videoLength;
  try {
    videoLength = (await ytdl.getBasicInfo(arg[1])).videoDetails
        .lengthSeconds;
  } catch (error) {
    m.reply("Error al obtener la duracion del video, error de Youtube");
    return;
  }
  if (parseInt(videoLength) > 900) {
    m.reply("El video es demasiado largo");
    return;
  }
  let stream;
  try {
    stream = youtube.download(ytdl.getVideoID(arg[1]), {
      quality: "360p",
      format: "mp4",
    });
  } catch (error) {
    m.reply("Error al descargar el video, esto es un error de YouTube, no del bot");
    return;
  }
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
