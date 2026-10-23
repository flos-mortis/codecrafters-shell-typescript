import { createInterface } from "readline";
import path from "node:path";
import {readdirSync, accessSync, constants} from 'node:fs';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();
rl.on('line', (command: string) => {
  switch(true) {
    case command === 'exit':
        rl.close()
        return
    case command.startsWith('echo '): 
        console.log(command.slice(5))
        break
    case command.startsWith('type '): {
        const commandName = command.slice(5)
        if (commandName === 'exit' || commandName === 'echo' || commandName === 'type') {
            console.log(`${commandName} is a shell builtin`)
            break
        } 
        else {
            const dirs = process.env.PATH.split(path.delimiter)
            for (let i = 0; i < dirs.length; i++) {
                try {
                    const files = readdirSync(dirs[i])  
                    if (files) {
                        const fileId = files.indexOf(commandName)
                        if (fileId !== -1) {
                            accessSync(`${dirs[i]}/${files[fileId]}`, constants.X_OK)
                                console.log(`${commandName} is ${dirs[i]}/${files[fileId]}`)
                                rl.prompt()
                                return
                            }
                        }
                }
                catch (err) {
                    continue
                }
            }
            console.log(`${commandName} not found`)
            break
        }
    }
    default:
      console.log(`${command}: command not found`);
  }
  rl.prompt()
});