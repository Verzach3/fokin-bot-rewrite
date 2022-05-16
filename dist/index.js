"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@adiwajshing/baileys"));
const promises_1 = require("fs/promises");
const BetterMessage_1 = __importDefault(require("./classes/BetterMessage"));
const mainHandler_1 = __importDefault(require("./handlers/mainHandler"));
const { state, saveState } = (0, baileys_1.useSingleFileAuthState)("./auth.json");
(0, promises_1.mkdir)("./media").catch((e) => { console.log(e); });
async function startBot() {
    const reminders = [];
    const socket = (0, baileys_1.default)({
        auth: state,
        printQRInTerminal: true,
    });
    // Make connection
    socket.ev.on("connection.update", (update) => {
        var _a, _b;
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const shouldReconnect = ((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !==
                baileys_1.DisconnectReason.loggedOut;
            console.log("connection closed due to error ", 
            // lastDisconnect!.error,
            ", reconnecting ", shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        }
        else if (connection === "open") {
            console.log("Connection opened");
        }
    });
    socket.ev.on("creds.update", saveState);
    socket.ev.on("messages.upsert", async ({ messages, type }) => {
        const message = messages[0];
        if (message.key.remoteJid === "status@broadcast") {
            return;
        }
        const m = new BetterMessage_1.default(messages[0], socket);
        if (m.checkCommand("!getMentioned")) {
            m.reply(JSON.stringify(m.getMentionedUsers()));
        }
        console.log(`[MESSAGE]`, m.getRealSender(), m.getText());
        message.key.fromMe ? console.log("[SENT]") : console.log("[RECEIVED]");
        console.log(message.pushName);
        (0, mainHandler_1.default)(m);
    });
    socket.ev.on("messages.reaction", ({ reaction, key, operation }) => {
        console.log(`[KEY: ${key.remoteJid}] ${operation} ${reaction}`);
        console.log(reaction);
    });
}
startBot();
