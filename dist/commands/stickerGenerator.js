"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const nanoid_1 = require("nanoid");
const sharp_1 = __importDefault(require("sharp"));
async function stickerGenerator(m, args) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    console.log("[TYPE]", m.getType());
    if (m.getType() !== "imageMessage" &&
        m.getType() !== "videoMessage" &&
        m.getType() !== "extendedTextMessage") {
        m.reply("No enviaste o mencionaste ninguna Imagen/Video");
        return;
    }
    const filename = `./media/${(0, nanoid_1.nanoid)()}`;
    let extension = m.getType() === "imageMessage" ? ".jpeg" : ".mp4";
    if (m.getType() === "extendedTextMessage") {
        if ((_d = (_c = (_b = (_a = m.message.message) === null || _a === void 0 ? void 0 : _a.extendedTextMessage) === null || _b === void 0 ? void 0 : _b.contextInfo) === null || _c === void 0 ? void 0 : _c.quotedMessage) === null || _d === void 0 ? void 0 : _d.imageMessage) {
            extension = ".jpeg";
        }
        else if ((_h = (_g = (_f = (_e = m.message.message) === null || _e === void 0 ? void 0 : _e.videoMessage) === null || _f === void 0 ? void 0 : _f.contextInfo) === null || _g === void 0 ? void 0 : _g.quotedMessage) === null || _h === void 0 ? void 0 : _h.videoMessage) {
            extension = ".mp4";
        }
        else {
            m.reply("No enviaste o mencionaste ninguna Imagen/Video");
            return;
        }
    }
    await m.downloadAttachment(filename, extension);
    if (extension === ".mp4") {
        await new Promise((resolve, reject) => {
            (0, fluent_ffmpeg_1.default)(filename + extension)
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
    await (0, sharp_1.default)(`${filename}${extension === ".jpeg" ? extension : ".webp"}`, {
        animated: true,
    })
        .resize({ width: 512, height: 512 })
        .webp({ quality: extension === ".jpeg" ? 100 : 80 })
        .toFile(filename + "-1" + ".webp");
    await m.sendSticker(m.getChatSender(), filename + "-1" + ".webp");
}
exports.default = stickerGenerator;
