"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = require("@adiwajshing/baileys");
const promises_1 = require("fs/promises");
class BetterMessage {
    constructor(message, socket) {
        var _a, _b;
        this.message = message;
        this.isGroup = false;
        this.betterMessage = this;
        this.message = message;
        this.socket = socket;
        if ((_b = (_a = this.message) === null || _a === void 0 ? void 0 : _a.key.remoteJid) === null || _b === void 0 ? void 0 : _b.endsWith("@g.us")) {
            this.isGroup = true;
        }
    }
    getChatSender() {
        return this.message.key.remoteJid;
    }
    getRealSender() {
        if (this.isGroup) {
            return this.message.key.participant;
        }
        return this.getChatSender();
    }
    isImage() {
        var _a;
        return ((_a = this.message.message) === null || _a === void 0 ? void 0 : _a.imageMessage) ? true : false;
    }
    isVideo() {
        var _a;
        return ((_a = this.message.message) === null || _a === void 0 ? void 0 : _a.videoMessage) ? true : false;
    }
    isAudio() {
        var _a;
        return ((_a = this.message.message) === null || _a === void 0 ? void 0 : _a.audioMessage) ? true : false;
    }
    async downloadAttachment(path, extension) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const mediaType = this.getType();
        let stream = null;
        let buffer = Buffer.from([]);
        if (mediaType === "imageMessage") {
            if ((_b = (_a = this.message.message) === null || _a === void 0 ? void 0 : _a.imageMessage) === null || _b === void 0 ? void 0 : _b.mediaKey)
                stream = await (0, baileys_1.downloadContentFromMessage)(this.message.message.imageMessage, "image");
        }
        if (mediaType === "videoMessage") {
            if ((_c = this.message.message) === null || _c === void 0 ? void 0 : _c.videoMessage) {
                stream = await (0, baileys_1.downloadContentFromMessage)(this.message.message.videoMessage, "video");
            }
        }
        if (mediaType === "audioMessage") {
            if ((_d = this.message.message) === null || _d === void 0 ? void 0 : _d.audioMessage) {
                stream = await (0, baileys_1.downloadContentFromMessage)(this.message.message.audioMessage, "audio");
            }
        }
        if (mediaType === "documentMessage") {
            if ((_e = this.message.message) === null || _e === void 0 ? void 0 : _e.documentMessage) {
                stream = await (0, baileys_1.downloadContentFromMessage)(this.message.message.documentMessage, "document");
            }
        }
        if (mediaType === "extendedTextMessage") {
            if ((_j = (_h = (_g = (_f = this.message.message) === null || _f === void 0 ? void 0 : _f.extendedTextMessage) === null || _g === void 0 ? void 0 : _g.contextInfo) === null || _h === void 0 ? void 0 : _h.quotedMessage) === null || _j === void 0 ? void 0 : _j.imageMessage) {
                stream = await (0, baileys_1.downloadContentFromMessage)(this.message.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage, "image");
            }
            if ((_o = (_m = (_l = (_k = this.message.message) === null || _k === void 0 ? void 0 : _k.extendedTextMessage) === null || _l === void 0 ? void 0 : _l.contextInfo) === null || _m === void 0 ? void 0 : _m.quotedMessage) === null || _o === void 0 ? void 0 : _o.videoMessage) {
                stream = await (0, baileys_1.downloadContentFromMessage)(this.message.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage, "video");
            }
        }
        if (stream === null) {
            console.log("[ERROR - ATACHMENT - STREAM IS NULL]");
            return;
        }
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        await (0, promises_1.writeFile)(path + extension, buffer);
    }
    getMentionedUsers() {
        var _a, _b, _c;
        const mentionedUser = (_c = (_b = (_a = this.message.message) === null || _a === void 0 ? void 0 : _a.extendedTextMessage) === null || _b === void 0 ? void 0 : _b.contextInfo) === null || _c === void 0 ? void 0 : _c.mentionedJid;
        if (mentionedUser !== undefined && mentionedUser !== null) {
            return mentionedUser;
        }
        return [];
    }
    getText() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        let text = null;
        try {
            if ((_a = this.message.message) === null || _a === void 0 ? void 0 : _a.conversation) {
                if (((_b = this.message.message) === null || _b === void 0 ? void 0 : _b.conversation) !== null) {
                    text = (_c = this.message.message) === null || _c === void 0 ? void 0 : _c.conversation;
                }
            }
            if ((_e = (_d = this.message.message) === null || _d === void 0 ? void 0 : _d.extendedTextMessage) === null || _e === void 0 ? void 0 : _e.text) {
                if (((_g = (_f = this.message.message) === null || _f === void 0 ? void 0 : _f.extendedTextMessage) === null || _g === void 0 ? void 0 : _g.text) !== null) {
                    text = (_j = (_h = this.message.message) === null || _h === void 0 ? void 0 : _h.extendedTextMessage) === null || _j === void 0 ? void 0 : _j.text;
                }
            }
            if ((_l = (_k = this.message.message) === null || _k === void 0 ? void 0 : _k.imageMessage) === null || _l === void 0 ? void 0 : _l.caption) {
                if (((_o = (_m = this.message.message) === null || _m === void 0 ? void 0 : _m.imageMessage) === null || _o === void 0 ? void 0 : _o.caption) !== null) {
                    text = (_q = (_p = this.message.message) === null || _p === void 0 ? void 0 : _p.imageMessage) === null || _q === void 0 ? void 0 : _q.caption;
                }
            }
            if ((_s = (_r = this.message.message) === null || _r === void 0 ? void 0 : _r.videoMessage) === null || _s === void 0 ? void 0 : _s.caption) {
                if (((_u = (_t = this.message.message) === null || _t === void 0 ? void 0 : _t.videoMessage) === null || _u === void 0 ? void 0 : _u.caption) !== null) {
                    text = (_w = (_v = this.message.message) === null || _v === void 0 ? void 0 : _v.videoMessage) === null || _w === void 0 ? void 0 : _w.caption;
                }
            }
        }
        catch (error) { }
        if (text !== null && text !== undefined) {
            return text.toString();
        }
        else {
            return "Text not found";
        }
    }
    getType() {
        return Object.keys(this.message.message)[0];
    }
    getSplitText() {
        const text = this.getText();
        if (text) {
            return text.split(" ");
        }
        return null;
    }
    isCommand() {
        const text = this.getText();
        if (text) {
            if (text.startsWith("!")) {
                return true;
            }
        }
        return false;
    }
    async getGroupMetadata() {
        if (this.isGroup) {
            const groupMetadata = await this.socket.groupMetadata(this.getChatSender());
            return groupMetadata;
        }
        return null;
    }
    async isAdmin(id) {
        const groupMetadata = await this.getGroupMetadata();
        if (groupMetadata !== null) {
            let admin = false;
            groupMetadata.participants.map((participant) => {
                if (participant.id === id && (participant.admin === "admin" || participant.admin === "superadmin")) {
                    admin = true;
                }
            });
            return admin;
        }
    }
    async isSenderAdmin() {
        return this.isAdmin(this.getRealSender());
    }
    async makeAdmin(to) {
    }
    getSenderPushName() {
        let name = "No Name";
        const pushName = this.message.pushName;
        if (pushName) {
            name = pushName;
        }
        return name;
    }
    parseCommand(text, delimiter) {
        const command = text.split(delimiter)[0];
        const args = text.split(delimiter).slice(1);
        return { command, args };
    }
    checkCommand(command, delimiter) {
        if (delimiter === undefined) {
            delimiter = " ";
        }
        if (this.parseCommand(this.getText(), delimiter).command === command) {
            return true;
        }
        return false;
    }
    async sendText(to, text) {
        await this.socket.sendMessage(this.getChatSender(), { text: text });
    }
    async reply(text) {
        this.sendText(this.getChatSender(), text);
    }
    async sendImage(to, imagePath) {
        let imageFile = null;
        try {
            imageFile = await (0, promises_1.readFile)(imagePath);
        }
        catch (error) {
            await this.sendText(to, "Error al enviar la imagen");
            return;
        }
        await this.socket.sendMessage(this.getChatSender(), { image: imageFile });
    }
    async replyImage(imagePath) {
        this.sendImage(this.getChatSender(), imagePath);
    }
    async sendVideo(to, videoPath) {
        let videoFile = null;
        try {
            videoFile = await (0, promises_1.readFile)(videoPath);
        }
        catch (error) {
            await this.sendText(to, "Error al enviar el video");
            return;
        }
        await this.socket.sendMessage(this.getChatSender(), { video: videoFile });
    }
    async replyVideo(videoPath) {
        this.sendVideo(this.getChatSender(), videoPath);
    }
    async sendAudio(to, audioPath) {
        let audioFile = null;
        try {
            audioFile = await (0, promises_1.readFile)(audioPath);
        }
        catch (error) {
            await this.sendText(to, "Error al enviar el audio");
            return;
        }
        await this.socket.sendMessage(this.getChatSender(), { audio: audioFile });
    }
    async replyAudio(audioPath) {
        this.sendAudio(this.getChatSender(), audioPath);
    }
    async sendSticker(to, stickerPath) {
        let stickerFile = null;
        try {
            stickerFile = await (0, promises_1.readFile)(stickerPath);
        }
        catch (error) {
            await this.sendText(to, "Error al enviar el sticker");
            return;
        }
        await this.socket.sendMessage(this.getChatSender(), {
            sticker: stickerFile,
        });
    }
    async replySticker(stickerPath) {
        this.sendSticker(this.getChatSender(), stickerPath);
    }
    async banMentionedUsers() {
        if (!(await this.isSenderAdmin()))
            return;
        await this.socket.groupParticipantsUpdate(this.getChatSender(), [...this.getMentionedUsers()], "remove");
    }
    async banUser(user) {
        if (!(await this.isSenderAdmin()))
            return;
        await this.socket.groupParticipantsUpdate(this.getChatSender(), [user], "remove");
    }
}
exports.default = BetterMessage;
