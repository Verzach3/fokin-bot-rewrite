"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stickerGenerator_1 = __importDefault(require("./stickerGenerator"));
const math_expression_evaluator_1 = __importDefault(require("math-expression-evaluator"));
const ytDownloader_1 = __importDefault(require("./ytDownloader"));
const commands = [
    {
        name: "Ping",
        description: "Pingea el bot",
        usage: "ping",
        aliases: ["!ping", "!pong"],
        execute(message, args) {
            message.reply("pong");
        },
    },
    {
        name: "Sticker Generator",
        description: "Genera stickers con la imagen/video enviada o mencionada",
        usage: "!stick [imagen/video]",
        aliases: ["!stick", "!sticker", "!stk"],
        execute(message, args) {
            (0, stickerGenerator_1.default)(message, args);
        },
    },
    {
        name: "Random Number",
        description: "Genera un numero aleatorio",
        usage: "!random [min] [max]",
        aliases: ["!rand", "!rnd", "!random"],
        execute(message, args) {
            const min = parseInt(args[0]) || 0;
            const max = parseInt(args[1]) || 100;
            message.reply(Math.floor(Math.random() * (max - min + 1) + min).toString());
        },
    },
    {
        name: "Math Solver",
        description: "Resuelve una operacion matematica",
        usage: "!math [operacion]",
        aliases: ["!math", "!mat", "!solve"],
        execute(message, args) {
            const result = math_expression_evaluator_1.default.eval(args.join(" "));
            message.reply(result.toString());
        },
    },
    {
        name: "Help",
        description: "Muestra la ayuda del bot",
        usage: "!help [comando]",
        aliases: ["!help", "!ayuda", "!ayudar", "!ayudame"],
        execute(message, args) {
            const answer = [];
            answer.push(`
╭──┈ ➤ ✎ 【﻿ＭＥＮＵ】
`);
            commands.forEach((command) => {
                if (args.length === 0) {
                    answer.push(` ➤ **${command.name}**: ${command.description}\n *Uso*: ${command.usage}`);
                }
                else if (args[0] === command.name || args[0] === command.aliases[0]) {
                    answer.push(` ➤ **${command.name}**: ${command.description}\n *Uso*: ${command.usage}\n *Alias*: ${command.aliases.join(" | ")}`);
                }
            });
            answer.push(`
│ Mas en camino!
╰─────────────❁ཻུ۪۪⸙͎`);
            message.reply(answer.join("\n\n"));
        },
    },
    {
        name: "Download",
        description: "Descarga un video o cancion de youtube",
        usage: "!dl [audio/video] [url/link]",
        aliases: ["!dl", "!descargar", "!descarga"],
        execute(message, args) {
            (0, ytDownloader_1.default)(message, args);
        },
    },
    {
        name: "Report",
        description: "Reporta un problema al desarrollador",
        usage: "!report [mensaje]",
        aliases: ["!report", "!reportar"],
        execute(message, args) {
            message.reply(`Reporte enviado!`);
            message.sendText("573135408570@s.whatsapp.net", `Reporte de ${message.getRealSender()}:\n${args.join(" ")}`);
        },
    },
    {
        name: "Credits",
        description: "Muestra los creditos del bot",
        usage: "!credits",
        aliases: ["!credits", "!creditos", "!credit"],
        execute(message, args) {
            message.reply("*[Desarrollador]*\n_Verzach3_\n+573135408570");
        },
    },
];
exports.default = commands;
