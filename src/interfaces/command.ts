import BetterMessage from "../classes/BetterMessage";

export default interface Command {
  name: string;
  description: string;
  usage: string;
  aliases: string[];
  execute(message: BetterMessage, args: string[]): void;
}