import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();
rl.on('line', (command) => {
  if(command === 'exit') {
    process.exit(0)
  }
  console.log(`${command}: command not found`);
  rl.prompt()
});