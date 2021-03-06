import BetterMessage from "../classes/BetterMessage";
import Command from "../interfaces/command";
import stickerGenerator from "./stickerGenerator";
import Mexp from "math-expression-evaluator";
import ytDownloader from "./ytDownloader";
const commands: Command[] = [
  // Ping
  {
    name: "Ping",
    description: "Pingea el bot",
    usage: "ping",
    aliases: ["!ping", "!pong"],
    execute(message: BetterMessage, args?: string[]): void {
      message.reply("pong");
    },
    debug: true
  },
  // Sticker generator
  {
    name: "Sticker Generator",
    description: "Genera stickers con la imagen/video enviada o mencionada",
    usage: "!stick [imagen/video]",
    aliases: ["!stick", "!sticker", "!stk"],
    async execute(message: BetterMessage, args: String[]) {
      await stickerGenerator(message, args);
    },
  },
  // Random number
  {
    name: "Random Number",
    description: "Genera un numero aleatorio",
    usage: "!random [min] [max]",
    aliases: ["!rand", "!rnd", "!random"],
    async execute(message: BetterMessage, args: string[]) {
      const min = parseInt(args[0]) || 0;
      const max = parseInt(args[1]) || 100;
      message.reply(
        Math.floor(Math.random() * (max - min + 1) + min).toString()
      );
    },
  },
  // Math
  {
    name: "Math Solver",
    description: "Resuelve una operacion matematica",
    usage: "!math [operacion]",
    aliases: ["!math", "!mat", "!solve"],
    execute(message: BetterMessage, args: string[]) {
      const result = Mexp.eval(args.join(" "));
      message.reply(result.toString());
    },
  },
  {
    name: "Help",
    description: "Muestra la ayuda del bot",
    usage: "!help [comando]",
    aliases: ["!help", "!ayuda", "!ayudar", "!ayudame", "!comandos"],
    execute(message: BetterMessage, args: string[]) {
      const answer: string[] = [];
      answer.push(`
╭──┈ ➤ ✎ 【﻿ＭＥＮＵ】
`);
      commands.forEach((command) => {
        if (args.length === 0 && command.debug !== true) {
          answer.push(
            ` ➤ **${command.name}**: ${command.description}\n *Uso*: ${command.usage}`
          );
        } else if (args[0] === command.name || args[0] === command.aliases[0]) {
          answer.push(
            ` ➤ **${command.name}**: ${command.description}\n *Uso*: ${
              command.usage
            }\n *Alias*: ${command.aliases.join(" | ")}`
          );
        }
      });
      answer.push(`
│ Mas en camino!
╰─────────────❁ཻུ۪۪⸙͎`);
      message.reply(answer.join("\n\n"));
    },
  },
  // Download
  {
    name: "Download",
    description: "Descarga un video o cancion de youtube",
    usage: "!dl [audio/video] [url/link]",
    aliases: ["!dl", "!descargar", "!descarga"],
    async execute(message: BetterMessage, args: string[]) {
      ytDownloader(message, args);
    },
  },
  // Report
  {
    name: "Report",
    description: "Reporta un problema al desarrollador",
    usage: "!report [mensaje]",
    aliases: ["!report", "!reportar"],
    execute(message: BetterMessage, args: string[]) {
      message.reply(`Reporte enviado!`);
      message.sendText(
        "573135408570@s.whatsapp.net",
        `Reporte de ${message.getRealSender()!}:\n${args.join(" ")}`
      );
    },
  },
  // Credits
  {
    name: "Credits",
    description: "Muestra los creditos del bot",
    usage: "!credits",
    aliases: ["!credits", "!creditos", "!credit"],
    execute(message: BetterMessage, args: string[]) {
      message.reply("*[Desarrollador]*\n_Verzach3_\n");
    },
  },
  // Ban
  {
    name: "Ban",
    description: "Banear a un usuario",
    usage: "!ban [usuario]",
    aliases: ["!ban", "!banear"],
    async execute(message: BetterMessage, args: string[]) {
      if (!message.isGroup) {
        message.reply("No puedes banear a un usuario en un mensaje privado");
        return;
      }
      if (!(await message.isSenderAdmin())) {
        message.reply("No tienes permisos para banear a un usuario");
        return;
      }
      await message.banMentionedUsers();
      await message.banUser(
        message.message.message?.extendedTextMessage?.contextInfo?.participant!
      );
      await message.reply("Baneado!");
    },
  },
  // Warn
  {
    name: "Warn",
    description: "Advertir a un usuario",
    usage: "!warn [usuario]",
    aliases: ["!warn", "!advertir"],
    async execute(message: BetterMessage, args: string[]) {
      if(!message.isGroup){
        message.reply("No puedes advertir a un usuario en un mensaje privado");
        return;
      }
      
    },
  },
  // Get Quoted
  {
    name: "Get Quoted",
    description: "Obtiene un mensaje citado",
    usage: "!getquoted",
    aliases: ["!getquoted", "!quote", "!cita"],
    async execute(message: BetterMessage, args: string[]) {
      message.reply(
        JSON.stringify(message.message.message?.extendedTextMessage!)
      );
    },
    debug: true,
  },
  // Get Message
  {
    name: "Get message",
    description: "Obtiene un mensaje",
    usage: "!getmessage [mensaje]",
    aliases: ["!getmessage", "!getmsg", "!msg", "!mensaje"],
    async execute(message: BetterMessage, args: string[]) {
      message.reply(JSON.stringify(message.message.message!));
    },
    debug: true,
  },
  // Sexo :v
  {
    name: "Sexo",
    description:
      "Comando especial para el grupo de Xsequias, en especial para Anto",
    usage: "!sexo",
    aliases: ["!sexo"],
    async execute(message: BetterMessage, args: string[]) {
      if (message.getRealSender() === "5214443031664@s.whatsapp.net") {
        message.reply("Sexo");
        return;
      }
    },
  },
];

export default commands;
