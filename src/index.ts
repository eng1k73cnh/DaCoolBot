import { Client, Collection, Intents } from "discord.js";
import * as dotenv from "dotenv";
import fs from "node:fs";

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
	client.user.setPresence({
		activities: [{ name: "your mom", type: "WATCHING" }],
		status: "idle"
	});
	console.log("Ready!");
});

client.commands = new Collection();
const commandFiles = fs
	.readdirSync("./dist/commands")
	.filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.login(process.env.TOKEN);
