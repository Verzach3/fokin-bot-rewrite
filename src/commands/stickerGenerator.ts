import { proto } from "@adiwajshing/baileys";
import ff from "fluent-ffmpeg";
import { statSync } from "fs";
import { nanoid } from "nanoid";
import sharp from "sharp";
import BetterMessage from "../classes/BetterMessage";

export default async function stickerGenerator(
  m: BetterMessage,
  args: String[]
): Promise<void> {
  console.log("[TYPE]", m.getType());
  if (
    m.getType() !== "imageMessage" &&
    m.getType() !== "videoMessage" &&
    m.getType() !== "extendedTextMessage"
    ) {
      await m.reply("No enviaste o mencionaste ninguna Imagen/Video");
    return;
  }

  const filename = `./media/${nanoid()}`;
  let extension = m.getType() === "imageMessage" ? ".jpeg" : ".mp4";
  if (m.getType() === "extendedTextMessage") {
    if (
      m.message.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.imageMessage!
    ) {
      extension = ".jpeg";
    } else if (
      m.message.message?.videoMessage?.contextInfo?.quotedMessage?.videoMessage!
    ) {
      extension = ".mp4";
    }else {
      await m.reply("No enviaste o mencionaste ninguna Imagen/Video");
      return;
    }
  }

  await m.downloadAttachment(filename, extension);

  if (extension === ".mp4") {
    await new Promise((resolve, reject) => {
      ff(filename + extension)
        .on("error", reject)
        .on("end", () => resolve(true))
        .addOutputOptions([
          `-vcodec`,
          `libwebp`,
          `-vf`,
          `scale=512:512:force_original_aspect_ratio=increase,fps=15,crop=512:512`,
        ])
        .toFormat("webp")
        .save(filename + ".webp");
    });
  }

  await sharp(`${filename}${extension === ".jpeg" ? extension : ".webp"}`, {
    animated: true,
  })
    .resize({ width: 512, height: 512 })
    .webp({ quality: extension === ".jpeg" ? 100 : 80 })
    .toFile(filename + "-1" + ".webp");
  if (statSync(filename + "-1" + ".webp").size > 1000000) {
    m.reply("Stiker demasiado grande, intenta con una imagen/video mas pequeña o corto");
    return;
  }
  await m.sendSticker(m.getChatSender()!, filename + "-1" + ".webp");
}
