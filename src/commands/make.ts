import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, GuildMemberRoleManager, Interaction } from "discord.js";
import axios from "axios";
import { ImgurClient } from "imgur";
import fs from "node:fs";

module.exports = {
	//#region Data property
	data: new SlashCommandBuilder()
		.setName("make")
		.setDescription("Make a new reminder message")
		.addStringOption(option =>
			option
				.setName("message")
				.setDescription(
					"(Pastebin / Google Spreadsheets URL containing) eminder message content"
				)
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

			// Check if input string matches Pastebin URL through RegExp pattern
			if (message.match(/^(http(s)?[:][\\/][\\/])?pastebin[.]com/gm)) {
				const pastebin = message.split("/");

				//#region Get RAW Pastebin data
				axios
					.get(`https://pastebin.com/raw/${pastebin[pastebin.length - 1]}`)
					.then(async response => {
						await interaction.reply(response.data);
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
			} else if (
				// Check if input string matches Google Spreadsheets URL through RegExp pattern
				message.match(
					/^(http(s))?[:][\\/][\\/]docs[.]google[.]com[\\/]spreadsheets[\\/]*/gm
				)
			) {
				await interaction.reply(
					"Stage 1/2\n🟦 Taking screenshot...\n🟦 Upload to Imgur"
				);

				// Dynamically import "capture-website" ES Module in CommonJS
				// Use Imgur credentials
				const captureWebsite = await (Function(
						"return import('capture-website')"
					)() as Promise<typeof import("capture-website")>),
					imgurClient = new ImgurClient({
						clientId: process.env.IMGUR_CLIENT_ID,
						clientSecret: process.env.IMGUR_CLIENT_SECRET
					});

				//#region Take screenshot of the given webpage and save it locally
				await captureWebsite.default
					.file(message, "dcr.png", {
						element: "#docs-editor-container",
						hideElements: ["div[role='navigation']"],
						launchOptions: {
							// --no-sandbox because Heroku does not support it, delete "launchOptions" if deploy elsewhere
							args: ["--no-sandbox", "--disable-setuid-sandbox"]
						}
					})
					.then(() =>
						interaction.editReply(
							"Stage 2/2\n✅ Taken screenshot\n🟦 Uploading to Imgur..."
						)
					)
					.catch(async error => {
						console.error(error);
						await interaction.editReply(
							"Stage 1/2\n❎ Failed to take screenshot\n🟦 Uploading to Imgur..."
						);
					});
				//#endregion

				//#region Send the screenshot taken to Imgur using given credentials
				await imgurClient
					.upload({
						image: fs.createReadStream("dcr.png") as unknown as ReadableStream,
						type: "stream"
					})
					.then(async response => {
						await interaction.editReply(
							`DaCoolReminder (as of ${new Date(
								Date.now() + 7 * 3600 * 1000
							).toLocaleString("en-US", {
								weekday: "long",
								month: "long",
								day: "numeric",
								year: "numeric"
							})})\n${response.data.link}`
						);
					})
					.catch(async error => {
						console.error(error);
						await interaction.editReply(
							"Stage 2/2\n✅ Taken screenshot\n❎ Failed to upload to Imgur"
						);
					});
				//#endregion

				// Delete the screenshot afterwards
				fs.rmSync("dcr.png", {
					force: true
				});
			} else await interaction.reply(message);

			if (options.getBoolean("mention")) {
				let mentionMsg = `@everyone DaCoolReminder is updated for ${new Date(
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
