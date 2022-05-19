import { downloadContentFromMessage, proto } from "@adiwajshing/baileys";
import { readFile, writeFile } from "fs/promises";
import { JsonDB } from "node-json-db";
import Socket from "../interfaces/socket";

export default class BetterMessage {
  socket: Socket;
  isGroup: boolean = false;
  betterMessage: this = this;
  db: JsonDB = null as any;
  constructor(
    public message: proto.IWebMessageInfo,
    socket: Socket,
    db: JsonDB
  ) {
    this.message = message;
    this.socket = socket;
    if (this.message?.key.remoteJid?.endsWith("@g.us")) {
      this.isGroup = true;
    }
    if (db) {
      this.db = db;
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
    return this.message.message?.imageMessage ? true : false;
  }

  isVideo() {
    return this.message.message?.videoMessage ? true : false;
  }

  isAudio() {
    return this.message.message?.audioMessage ? true : false;
  }

  async downloadAttachment(path: string, extension: string) {
    const mediaType = this.getType()!;
    let stream = null;
    let buffer = Buffer.from([]);
    if (mediaType === "imageMessage") {
      if (this.message.message?.imageMessage?.mediaKey)
        stream = await downloadContentFromMessage(
          this.message.message.imageMessage! as any,
          "image"
        );
    } else
    if (mediaType === "videoMessage") {
      if (this.message.message?.videoMessage!) {
        stream = await downloadContentFromMessage(
          this.message.message.videoMessage! as any,
          "video"
        );
      }
    } else
    if (mediaType === "audioMessage") {
      if (this.message.message?.audioMessage!) {
        stream = await downloadContentFromMessage(
          this.message.message.audioMessage! as any,
          "audio"
        );
      }
    } else
    if (mediaType === "documentMessage") {
      if (this.message.message?.documentMessage!) {
        stream = await downloadContentFromMessage(
          this.message.message.documentMessage! as any,
          "document"
        );
      }
    } else
    if (mediaType === "extendedTextMessage") {
      if (
        this.message.message?.extendedTextMessage?.contextInfo?.quotedMessage
          ?.imageMessage!
      ) {
        stream = await downloadContentFromMessage(
          this.message.message.extendedTextMessage.contextInfo.quotedMessage
            .imageMessage! as any,
          "image"
        );
      } else
      if (
        this.message.message?.extendedTextMessage?.contextInfo?.quotedMessage
          ?.videoMessage!
      ) {
        stream = await downloadContentFromMessage(
          this.message.message.extendedTextMessage.contextInfo.quotedMessage
            .videoMessage! as any,
          "video"
        );
      }
    }

    if (stream === null) {
      console.log("[ERROR - ATACHMENT - STREAM IS NULL]");
      return;
    }
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    await writeFile(path + extension, buffer);
  }

  getMentionedUsers() {
    const mentionedUser =
      this.message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (mentionedUser !== undefined && mentionedUser !== null) {
      return mentionedUser;
    }
    return [];
  }

  getText() {
    let text = null;
    try {
      if (this.message.message?.conversation) {
        if (this.message.message?.conversation !== null) {
          text = this.message.message?.conversation;
        }
      }
      if (this.message.message?.extendedTextMessage?.text) {
        if (this.message.message?.extendedTextMessage?.text !== null) {
          text = this.message.message?.extendedTextMessage?.text;
        }
      }
      if (this.message.message?.imageMessage?.caption) {
        if (this.message.message?.imageMessage?.caption !== null) {
          text = this.message.message?.imageMessage?.caption;
        }
      }
      if (this.message.message?.videoMessage?.caption) {
        if (this.message.message?.videoMessage?.caption !== null) {
          text = this.message.message?.videoMessage?.caption;
        }
      }
    } catch (error) {}

    if (text !== null && text !== undefined) {
      return text.toString();
    } else {
      return "Text not found";
    }
  }
  getType() {
    return Object.keys(this.message.message!)[0];
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
      const groupMetadata = await this.socket.groupMetadata(
        this.getChatSender()!
      );
      return groupMetadata;
    }
    return null;
  }

  async isAdmin(id: string) {
    const groupMetadata = await this.getGroupMetadata();
    if (groupMetadata !== null) {
      let admin = false;
      groupMetadata.participants.map((participant) => {
        if (
          participant.id === id &&
          (participant.admin === "admin" || participant.admin === "superadmin")
        ) {
          admin = true;
        }
      });
      return admin;
    }
  }

  async isSenderAdmin() {
    return this.isAdmin(this.getRealSender()!);
  }

  async makeAdmin(to: string) {}

  getSenderPushName() {
    let name = "No Name";
    const pushName = this.message.pushName!;
    if (pushName) {
      name = pushName;
    }
    return name;
  }

  parseCommand(text: string, delimiter: string) {
    const command = text.split(delimiter)[0];
    const args = text.split(delimiter).slice(1);
    return { command, args };
  }

  checkCommand(command: string, delimiter?: string) {
    if (delimiter === undefined) {
      delimiter = " ";
    }
    if (this.parseCommand(this.getText()!.toLowerCase(), delimiter).command === command) {
      return true;
    }
    return false;
  }

  async sendText(to: string, text: string) {
    await this.socket.sendMessage(to, { text: text });
  }

  async reply(text: string) {
    this.sendText(this.getChatSender()!, text);
  }

  async sendImage(to: string, imagePath: string) {
    let imageFile = null;
    try {
      imageFile = await readFile(imagePath);
    } catch (error) {
      await this.sendText(to, "Error al enviar la imagen");
      return;
    }
    await this.socket.sendMessage(this.getChatSender()!, { image: imageFile });
  }

  async replyImage(imagePath: string) {
    this.sendImage(this.getChatSender()!, imagePath);
  }

  async sendVideo(to: string, videoPath: string) {
    let videoFile = null;
    try {
      videoFile = await readFile(videoPath);
    } catch (error) {
      await this.sendText(to, "Error al enviar el video");
      return;
    }
    await this.socket.sendMessage(this.getChatSender()!, { video: videoFile });
  }

  async replyVideo(videoPath: string) {
    this.sendVideo(this.getChatSender()!, videoPath);
  }

  async sendAudio(to: string, audioPath: string) {
    let audioFile = null;
    try {
      audioFile = await readFile(audioPath);
    } catch (error) {
      await this.sendText(to, "Error al enviar el audio");
      return;
    }
    await this.socket.sendMessage(this.getChatSender()!, {
      audio: audioFile,
      mimetype: "audio/mp4",
    });
  }

  async replyAudio(audioPath: string) {
    this.sendAudio(this.getChatSender()!, audioPath);
  }

  async sendSticker(to: string, stickerPath: string) {
    let stickerFile = null;
    try {
      stickerFile = await readFile(stickerPath);
    } catch (error) {
      await this.sendText(to, "Error al enviar el sticker");
      return;
    }
    await this.socket.sendMessage(this.getChatSender()!, {
      sticker: stickerFile,
    });
  }

  async replySticker(stickerPath: string) {
    this.sendSticker(this.getChatSender()!, stickerPath);
  }

  async banMentionedUsers() {
    if (!(await this.isSenderAdmin())) return;
    await this.socket.groupParticipantsUpdate(
      this.getChatSender()!,
      [...this.getMentionedUsers()],
      "remove"
    );
  }

  async banUser(user: string) {
    if (!(await this.isSenderAdmin())) return;
    await this.socket.groupParticipantsUpdate(
      this.getChatSender()!,
      [user],
      "remove"
    );
  }
}
