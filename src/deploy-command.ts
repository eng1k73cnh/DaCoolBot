import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import * as dotenv from "dotenv";

// Why does CommonJS and ES Module have to coexist
import { default as edit } from "../dist/commands/edit.js";
import { default as make } from "../dist/commands/make.js";
import { default as send } from "../dist/commands/send.js";
import { default as set } from "../dist/commands/set.js";

dotenv.config();

const commands = [
	edit.data.toJSON(),
	make.data.toJSON(),
	send.data.toJSON(),
	set.data.toJSON()
];

new REST({ version: "9" })
	.setToken(process.env.TOKEN)
	.put(
		Routes.applicationGuildCommands(
			process.env.CLIENT_ID,
			process.env.GUILD_ID
		),
		{
			body: commands
		}
	)
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);
