import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, GuildMemberRoleManager, Interaction } from "discord.js";
import axios from "axios";

module.exports = {
	data: new SlashCommandBuilder()
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
	}
};
