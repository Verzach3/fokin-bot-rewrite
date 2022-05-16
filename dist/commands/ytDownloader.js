"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const nanoid_1 = require("nanoid");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const IT = require("youtubei.js");
async function ytDownloader(m, arg) {
    const filename = `./media/${(0, nanoid_1.nanoid)()}`;
    const youtube = await new IT();
    if (!(arg[0] === "video" || arg[0] === "audio")) {
        m.reply("Debes especificar si quieres descargar un video o audio");
        return;
    }
    if (!ytdl_core_1.default.validateURL(arg[1])) {
        m.reply("URL invalida");
        return;
    }
    const stream = youtube.download(ytdl_core_1.default.getVideoID(arg[1]), {
        quality: "360p",
        format: "mp4",
    });
    stream.pipe((0, fs_1.createWriteStream)(filename + ".mp4"));
    stream.on("start", () => {
        m.reply("Descargando...");
    });
    stream.on("end", async () => {
        if (arg[0] === "audio") {
            await new Promise((resolve, reject) => {
                (0, fluent_ffmpeg_1.default)(filename + ".mp4")
                    .on("error", reject)
                    .on("end", () => resolve(true))
                    .addOutputOptions(["-b:a", "192K", "-vn"])
                    .toFormat("mp3")
                    .save(filename + ".mp3");
            });
        }
        arg[0] === "audio" ? m.sendAudio(m.getChatSender(), filename + ".mp3") : m.sendVideo(m.getChatSender(), filename + ".mp4");
    });
}
exports.default = ytDownloader;
