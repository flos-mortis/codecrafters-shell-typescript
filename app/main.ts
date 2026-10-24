import { createInterface } from "readline";
import path from "node:path";
import { readdirSync, accessSync, constants, opendir } from "node:fs";
import { execFileSync } from "node:child_process";
import { env } from 'node:process';

const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "$ ",
});

const shellBuiltIn = ["exit", "echo", "type", "pwd"];

const findExecutable = (commandName: string) => {
	const dirs = env.PATH.split(path.delimiter);
	for (let i = 0; i < dirs.length; i++) {
		try {
			const files = readdirSync(dirs[i]);
			if (files) {
				const fileId = files.indexOf(commandName);
				if (fileId !== -1) {
					accessSync(`${dirs[i]}/${files[fileId]}`, constants.X_OK);
					return {
						fullPath: `${dirs[i]}/${files[fileId]}`,
						fileName: files[fileId],
					};
				}
			}
		} catch (err) {
			continue;
		}
	}
	return null;
};

rl.prompt();
rl.on("line", (command: string) => {
	switch (true) {
		case command === "exit":
			rl.close();
			return;
		case command === "pwd": {
			console.log(process.cwd());
			break;
		}
		case command.startsWith("echo "):
			console.log(command.slice(5));
			break;
		case command.startsWith("type "): {
			const commandName = command.slice(5);
			if (shellBuiltIn.includes(commandName)) {
				console.log(`${commandName} is a shell builtin`);
				break;
			} else {
				const executableDir = findExecutable(commandName);
				console.log(
					executableDir
						? `${commandName} is ${executableDir.fullPath}`
						: `${commandName} not found`,
				);
				break;
			}
		}
		case command.startsWith("cd "): {
			const path = command.split(" ")[1];
			const homeDir = env.HOME;
			//const homeDir = env.USERPROFILE;
			try {
				path === "~" ? process.chdir(homeDir) : process.chdir(path);
			} catch (err) {
				console.log(`cd: ${path}: No such file or directory`);
			}
			break;
		}
		default: {
			const commands = command.split(" ");
			if (commands.length === 1) {
				console.log(`${command}: command not found`);
				break;
			}
			const executableDir = findExecutable(commands[0]);
			if (executableDir) {
				try {
					const stdout = execFileSync(
						executableDir.fileName,
						commands.slice(1),
						{ encoding: "utf8" },
					);
					console.log(stdout.trimEnd());
				} catch (error) {
					console.error(`exec error: ${error}`);
					return;
				}
			}
		}
	}
	rl.prompt();
});
