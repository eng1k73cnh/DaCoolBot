import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import * as dotenv from "dotenv";
import fs from "node:fs";

dotenv.config();

const commands = [],
	commandFiles = fs
		.readdirSync("./dist/commands")
		.filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	commands.push(require(`./commands/${file}`).data.toJSON());
}

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
