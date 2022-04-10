import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Interaction } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("send")
		.setDescription("Write an anonymous message (only works in The Void)")
		.addStringOption(option =>
			option
				.setName("message")
				.setDescription("Message content")
				.setRequired(true)
		),
	async execute(interaction: Interaction<CacheType>) {
		if (!interaction.isCommand()) return;
		const { options, user, channel } = interaction;
		if (
			channel.id === "906124940003139594" ||
			user.id === "368399721494216706"
		) {
			const messageContent = options.getString("message");
			console.log(
				`${user.tag} sent "${messageContent}" at ${new Date(
					Date.now() + 7 * 3600 * 1000
				).toLocaleString("vi-VN")}`
			);
			await channel.send(messageContent);
			await interaction.reply({
				content: "Anonymous message sent",
				ephemeral: true
			});
		} else await interaction.reply({ content: "no", ephemeral: true });
	}
};
