/* eslint-disable @typescript-eslint/no-var-requires */

// #region Import library
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Client, Collection, Intents } from "discord.js";
import * as dotenv from "dotenv";
import fs from "node:fs";
import express from "express";
// #endregion

// Environment variable usage
dotenv.config();

// Declare Discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Run once when the Client is ready
client.once("ready", () => {
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

//#region Automatically register appication command upon deploy
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

// Log in as user
client.login(process.env.TOKEN);

// Own API
const app = express();

app.get("/", (req, res) => {
	const rest = new REST({ version: "9" }).setToken(process.env.TOKEN),
		fetchUser = async id => rest.get(Routes.user(id));

	if (!req.query.id) return res.send("No ID provided");
	// Return user info
	fetchUser(req.query.id)
		.then(user => res.send(user))
		.catch(err => res.send(err));
});

// Start the server
app.listen(process.env.PORT || 5000, () => {
	console.log("Server started");
});
