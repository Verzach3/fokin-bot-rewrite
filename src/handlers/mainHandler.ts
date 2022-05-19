import BetterMessage from "../classes/BetterMessage";
import commands from "../commands";

export default function mainHandler(m: BetterMessage): void {
  for (const command of commands) {
    for (const alias of command.aliases){
      if (m.checkCommand(alias)){
        command.execute(m, m.parseCommand(m.getText()!, " ").args)
        console.log(`[EXECUTED ${command.name} MESSAGE TYPE: ${m.getType()}] `)
        return
      }
    }
  }
  if (m.isCommand()) {
    console.log("[COMMAND NOT FOUND]")
  }
}
