import { SlashCommandBuilder } from "@discordjs/builders";
import {
	CacheType,
	ExcludeEnum,
	GuildMemberRoleManager,
	Interaction,
	PresenceStatusData
} from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";

module.exports = {
	// #region Data property
	data: new SlashCommandBuilder()
		.setName("set")
		.setDescription("Set the bot's presence status")
		.addStringOption(option =>
			option
				.setName("type")
				.setDescription("Activity type")
				.addChoices(
					{ name: "Playing", value: "PLAYING" },
					{ name: "Watching", value: "WATCHING" },
					{ name: "Streaming", value: "STREAMING" },
					{ name: "Listening to", value: "LISTENING" },
					{ name: "Competing", value: "COMPETING" }
				)
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("message")
				.setDescription("Activity title")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("status")
				.setDescription("Bot's status")
				.setRequired(true)
				.addChoices(
					{ name: "Do Not Disturb", value: "dnd" },
					{ name: "Invisible", value: "invisible" },
					{ name: "Idle", value: "idle" },
					{ name: "Online", value: "online" }
				)
		)
		.addStringOption(option =>
			option
				.setName("url")
				.setDescription("Stream link (Youtube/Twitch)")
				.setRequired(false)
		),
	//#endregion

	//#region exectute() function
	async execute(interaction: Interaction<CacheType>) {
		if (!interaction.isCommand()) return;
		const { options, user, member, client } = interaction;
		if (
			(member.roles as GuildMemberRoleManager).cache.some(
				role => role.name === "DaCoolCorp™"
			) ||
			user.id === "368399721494216706"
		) {
			// Read discord.js documents for more details
			client.user.setPresence({
				activities: [
					{
						name: options.getString("message"),
						type: options.getString("type") as ExcludeEnum<
							typeof ActivityTypes,
							"CUSTOM"
						>,
						url: options.getString("url")
					}
				],
				status: options.getString("status") as PresenceStatusData
			});
			await interaction.reply({
				content: "Bot's presence status set",
				ephemeral: true
			});
		} else await interaction.reply({ content: "no", ephemeral: true });
	}
	//#endregion
};
