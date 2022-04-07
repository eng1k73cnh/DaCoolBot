import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { clientId, token, guildId } from "./config.json";

const commands = [
  new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Make a new reminder message")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Reminder message content")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("edit")
    .setDescription("Edit a reminder message")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Reminder message ID")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("pastebin")
        .setDescription("Pastebin URL for reminder message content")
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands,
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
