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
	data: new SlashCommandBuilder()
		.setName("set")
		.setDescription("Set the bot's presence status")
		.addStringOption(option =>
			option
				.setName("type")
				.setDescription("Activity type")
				.addChoices([
					["Playing", "PLAYING"],
					["Watching", "WATCHING"],
					["Streaming", "STREAMING"],
					["Listening to", "LISTENING"],
					["Competing", "COMPETING"]
				])
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
				.addChoices([
					["Do Not Disturb", "dnd"],
					["Idle", "idle"],
					["Invisible", "invisible"],
					["Online", "online"]
				])
		)
		.addStringOption(option =>
			option
				.setName("url")
				.setDescription("Stream link (Youtube/Twitch)")
				.setRequired(false)
		),
	async execute(interaction: Interaction<CacheType>) {
		if (!interaction.isCommand()) return;
		const { options, user, member, client } = interaction;
		if (
			(member.roles as GuildMemberRoleManager).cache.some(
				role => role.name === "DaCoolCorp™"
			) ||
			user.id === "368399721494216706"
		) {
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
};
