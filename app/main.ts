import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();
rl.on('line', (command) => {
  switch(true) {
    case command === 'exit':
      rl.close()
      return
    case command.startsWith('echo '): 
      console.log(command.slice(5))
      break
    case command.startsWith('type '): {
      const commandType = command.slice(5)
      if (commandType === 'exit' || commandType === 'echo' || commandType === 'type') {
        console.log(`${commandType} is a shell builtin`)
      } else console.log(`${commandType}: not found`);
      break
    }
    default:
      console.log(`${command}: command not found`);
  }
  rl.prompt()
});