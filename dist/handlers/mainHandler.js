"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = __importDefault(require("../commands"));
function mainHandler(m) {
    for (const command of commands_1.default) {
        for (const alias of command.aliases) {
            if (m.checkCommand(alias)) {
                command.execute(m, m.parseCommand(m.getText(), " ").args);
                console.log(`[EXECUTED ${command.name}]`);
                return;
            }
        }
    }
    console.log("[COMMAND NOT FOUND]");
}
exports.default = mainHandler;
