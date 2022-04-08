import axios from "axios";
import { Client, GuildMemberRoleManager, Intents } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
	client.user.setPresence({
		activities: [{ name: "your mom" }],
		status: "idle"
	});
	console.log("Ready!");
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName, member, options, user, channel } = interaction;

	switch (commandName) {
		case "make":
			if (
				(member.roles as GuildMemberRoleManager).cache.some(
					role => role.name === "DaCoolCorp™"
				) ||
				user.id === "368399721494216706"
			) {
				const message = options.getString("message"),
					note = options.getString("note");
				if (message.match(/^(http(s)?[:][\\/][\\/])?pastebin[.]com/gm)) {
					const pastebin = message.split("/");
					axios
						.get(`https://pastebin.com/raw/${pastebin[pastebin.length - 1]}`)
						.then(async response => {
							await interaction.reply(response.data);
						})
						.catch(async error => {
							console.log(error);
							await interaction.reply({
								content:
									"Something was messed up, double check your Pastebin URL",
								ephemeral: true
							});
						});
				} else await interaction.reply(message);

				if (options.getBoolean("mention")) {
					let mentionMsg = `@everyone DaCoolReminder is updated for ${new Date().toLocaleString(
						"en-US",
						{ weekday: "long", month: "long", day: "numeric" }
					)}`;
					if (note) mentionMsg = `${mentionMsg} (${note})`;

					await channel.send(mentionMsg);
				}
			} else
				await interaction.reply({ content: "lmao no perms", ephemeral: true });
			break;
		case "edit":
			if (
				(member.roles as GuildMemberRoleManager).cache.some(
					role => role.name === "DaCoolCorp™"
				) ||
				user.id === "368399721494216706"
			) {
				const message = options.getString("message"),
					editMessage = await channel.messages.fetch(options.getString("id")),
					note = options.getString("note");
				if (!editMessage) {
					await interaction.reply({
						content: "Reminder message with given ID is not found",
						ephemeral: true
					});
				} else if (message.match(/^(http(s)?[:][\\/][\\/])?pastebin[.]com/gm)) {
					const pastebin = message.split("/");
					axios
						.get(`https://pastebin.com/raw/${pastebin[pastebin.length - 1]}`)
						.then(async response => {
							editMessage.edit(response.data);
							await interaction.reply({
								content: "Successfully edited reminder message",
								ephemeral: true
							});
						})
						.catch(async error => {
							console.log(error);
							await interaction.reply({
								content:
									"Something was messed up, double check your Pastebin URL",
								ephemeral: true
							});
						});
				} else {
					await editMessage.edit(message);
					await interaction.reply({
						content: "Successfully edited reminder message",
						ephemeral: true
					});
				}
				if (options.getBoolean("mention")) {
					let mentionMsg = `@everyone DaCoolReminder is updated for ${new Date().toLocaleString(
						"en-US",
						{ weekday: "long", month: "long", day: "numeric" }
					)}`;
					if (note) mentionMsg = `${mentionMsg} (${note})`;

					await channel.send(mentionMsg);
				}
			} else
				await interaction.reply({ content: "lmao no perms", ephemeral: true });
	}
});

client.login(process.env.TOKEN);
