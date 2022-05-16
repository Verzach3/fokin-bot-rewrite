import makeWASocket, {
  DisconnectReason,
  proto,
  useSingleFileAuthState,
} from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import Cron from "croner";
import { mkdir } from "fs/promises";
import BetterMessage from "./classes/BetterMessage";
import mainHandler from "./handlers/mainHandler";
import Reminder from "./interfaces/reminder";

const { state, saveState } = useSingleFileAuthState("./auth.json");
mkdir("./media").catch((e) => {console.log(e)})

async function startBot() {
  const reminders: Reminder[] = [];
  const socket = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  // Make connection
  socket.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect!.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to error ",
        // lastDisconnect!.error,
        ", reconnecting ",
        shouldReconnect
      );
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === "open") {
      console.log("Connection opened");
    }
  });

  socket.ev.on("creds.update", saveState);

  socket.ev.on("messages.upsert", async ({ messages, type }) => {
    const message = messages[0];
    if (message.key.remoteJid! === "status@broadcast") {
      return;
    }
    const m = new BetterMessage(messages[0]!, socket);
    if (m.checkCommand("!getMentioned")) {
      m.reply(JSON.stringify(m.getMentionedUsers()));
    }
    console.log(`[MESSAGE]`, m.getRealSender(), m.getText());
    message.key.fromMe ? console.log("[SENT]") : console.log("[RECEIVED]");
    console.log(message.pushName)
    mainHandler(m);
  });

  socket.ev.on("messages.reaction", ({ reaction, key, operation }) => {
    console.log(`[KEY: ${key.remoteJid}] ${operation} ${reaction}`);
    console.log(reaction)
  });
}

startBot();
