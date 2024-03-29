/* eslint-disable @typescript-eslint/no-var-requires */

// #region Import library
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Client, Collection, Intents } from "discord.js";
import * as dotenv from "dotenv";
import fs from "node:fs";
// #endregion

// Environment variable usage
dotenv.config();

// Declare Discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Run once when the Client is ready
client.once("ready", () => {
	const Guilds = client.guilds.cache.map(guild => guild.id);
	for (const guild of Guilds) {
		new REST({ version: "9" })
			.setToken(process.env.TOKEN)
			.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild), {
				body: commands
			});
	}

	client.user.setPresence({
		activities: [
			{
				name: "you",
				type: "STREAMING",
				url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
			}
		],
		status: "idle"
	});
	console.log("Ready!");
});

//#region Dynamically import command modules (CommonJS)
client.commands = new Collection();
const commands = [],
	commandFiles = fs
		.readdirSync("./dist/commands")
		.filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Data property declared in command module scripts
	client.commands.set(command.data.name, command);

	commands.push(require(`./commands/${file}`).data.toJSON());
}
//#endregion

//#region Receive slash command input
client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		// Call the execute() function declared in each command module scripts
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true
		});
	}
});
//#endregion

client.on("guildCreate", guild =>
	new REST({ version: "9" })
		.setToken(process.env.TOKEN)
		.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id), {
			body: commands
		})
		.then(() =>
			console.log(
				`Successfully registered application commands for guild ${guild.name}`
			)
		)
);

// Log in as user
client.login(process.env.TOKEN);
