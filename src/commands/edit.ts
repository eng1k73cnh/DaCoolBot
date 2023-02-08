import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, GuildMemberRoleManager, Interaction } from "discord.js";
import axios from "axios";

module.exports = {
	//#region Data property
	data: new SlashCommandBuilder()
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
				.setDescription(
					"(Pastebin / Google Spreadsheets URL containing) reminder message content"
				)
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("mention")
				.setDescription("Mention everyone after the message is created")
				.addChoices(
					{ name: "Everyone", value: "@everyone" },
					{ name: "Selected Soldiers", value: "<@&824591436975570985>" }
				)
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
	//#endregion

	//#region execute() function
	async execute(interaction: Interaction<CacheType>) {
		if (!interaction.isCommand()) return;

		const { member, options, user, channel } = interaction;

		if (
			(member.roles as GuildMemberRoleManager).cache.some(
				role => role.name === "DaCoolCorp™"
			) ||
			user.id === "368399721494216706"
		) {
			const message = options.getString("message"),
				note = options.getString("note");

			// Fetch the message with given ID in the same channel as where the interaction was created
			await channel.messages
				.fetch(options.getString("id"))
				.then(async editMessage => {
					// Check if input string matches Pastebin URL through RegExp pattern
					if (message.match(/^(http(s)?[:][\\/][\\/])?pastebin[.]com/gm)) {
						const pastebin = message.split("/");

						//#region Get RAW Pastebin data and edit the message with it
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
								console.error(error);
								await interaction.reply({
									content:
										"Something was messed up, double check your Pastebin URL",
									ephemeral: true
								});
							});
						//#endregion
					} else {
						await editMessage.edit(message);
						await interaction.reply({
							content: "Successfully edited reminder message",
							ephemeral: true
						});
					}
				})
				.catch(async error => {
					console.error(error);
					await interaction.reply({
						content: "Reminder message with given ID is not found",
						ephemeral: true
					});
				});
			if (options.getString("mention")) {
				let mentionMsg = `${options.getString(
					"mention"
				)} DaCoolReminder is updated for ${new Date(
					Date.now() + 7 * 3600 * 1000
				).toLocaleString("en-US", {
					weekday: "long",
					month: "long",
					day: "numeric",
					year: "numeric"
				})}`;
				if (note) mentionMsg = `${mentionMsg} (${note})`;

				await channel.send(mentionMsg);
			}
		} else
			await interaction.reply({ content: "lmao no perms", ephemeral: true });
	}
	//#endregion
};
