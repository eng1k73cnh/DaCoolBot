import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Interaction } from "discord.js";
import redis from "../redis";

module.exports = {
	//#region Data property
	data: new SlashCommandBuilder()
		.setName("shorten")
		.setDescription("Shorten a URL")
		.addStringOption(option =>
			option.setName("url").setDescription("URL to shorten").setRequired(true)
		),
	//#endregion

	//#region execute() function
	async execute(interaction: Interaction<CacheType>) {
		if (!interaction.isCommand()) return;

		const { options } = interaction;

		const url = options.getString("url");

		// Check if the URL is valid
		try {
			new URL(url);
		} catch (error) {
			await interaction.reply({
				content: "Invalid URL",
				ephemeral: true
			});
			return;
		}

		// Generate a random 6-character string
		let randomString = Math.random().toString(36).substring(2, 8);
		let table = await redis.hget("shortened", randomString);

		while (table) {
			randomString = Math.random().toString(36).substring(2, 8);
			table = await redis.hget("shortened", randomString);
		}

		// Store the shortened URL in the Redis database
		await redis.hset("shortened", randomString, url);

		await interaction.reply({
			content: `Shortened URL: https://api.kyrie25.dev/shorten/${randomString}`
		});
	}
	//#endregion
};
