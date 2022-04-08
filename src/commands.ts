import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import * as dotenv from "dotenv";

dotenv.config();

const commands = [
	new SlashCommandBuilder()
		.setName("make")
		.setDescription("Make a new reminder message")
		.addStringOption(option =>
			option
				.setName("message")
				.setDescription("(Pastebin URL containing) Reminder message content")
				.setRequired(true)
		)
		.addBooleanOption(option =>
			option
				.setName("mention")
				.setDescription("Mention everyone after the message is created")
				.setRequired(false)
		)
		.addStringOption(option =>
			option
				.setName("note")
				.setDescription(
					"Note in the mention message (useless if 'mention' is false)"
				)
				.setRequired(false)
		),
	new SlashCommandBuilder()
		.setName("edit")
		.setDescription("Edit a reminder message")
		.addStringOption(option =>
			option
				.setName("id")
				.setDescription("Reminder message ID")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("message")
				.setDescription("(Pastebin URL containing) Reminder message content")
				.setRequired(true)
		)
		.addBooleanOption(option =>
			option
				.setName("mention")
				.setDescription("Mention everyone after the message is created")
				.setRequired(false)
		)
		.addStringOption(option =>
			option
				.setName("note")
				.setDescription(
					"Note in the mention message (useless if 'mention' is false)"
				)
				.setRequired(false)
		)
].map(command => command.toJSON());

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
