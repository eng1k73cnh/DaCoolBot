import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Client, Collection, Intents } from "discord.js";
import * as dotenv from "dotenv";
import fs from "node:fs";

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
	client.user.setPresence({
		activities: [{ name: "your bathroom", type: "WATCHING" }],
		status: "idle"
	});
	console.log("Ready!");
});

client.commands = new Collection();
const commands = [],
	commandFiles = fs
		.readdirSync("./dist/commands")
		.filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	commands.push(require(`./commands/${file}`).data.toJSON());
}

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
