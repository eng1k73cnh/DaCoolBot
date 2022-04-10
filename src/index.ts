import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Client, Collection, Intents } from "discord.js";
import * as dotenv from "dotenv";

// Why does CommonJS and ES Module have to coexist
import { default as edit } from "../dist/commands/edit.js";
import { default as make } from "../dist/commands/make.js";
import { default as send } from "../dist/commands/send.js";
import { default as set } from "../dist/commands/set.js";

dotenv.config({ path: ".env.dev" });

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
	client.user.setPresence({
		activities: [{ name: "your bathroom", type: "WATCHING" }],
		status: "idle"
	});
	console.log("Ready!");
});

client.commands = new Collection();
const commands = [
	edit.data.toJSON(),
	make.data.toJSON(),
	send.data.toJSON(),
	set.data.toJSON()
];

client.commands.set(edit.data.name, edit);
client.commands.set(make.data.name, make);
client.commands.set(send.data.name, send);
client.commands.set(set.data.name, set);

client.on("guildCreate", guild => {
	new REST({ version: "9" })
		.setToken(process.env.TOKEN)
		.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id), {
			body: commands
		})
		.then(() => console.log("Successfully registered application commands."))
		.catch(console.error);
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true
		});
	}
});

client.login(process.env.TOKEN);
