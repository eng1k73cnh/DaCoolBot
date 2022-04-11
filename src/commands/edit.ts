import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, GuildMemberRoleManager, Interaction } from "discord.js";
import axios from "axios";
import { ImgurClient } from "imgur";
import fs from "node:fs";

module.exports = {
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
			await channel.messages
				.fetch(options.getString("id"))
				.then(async editMessage => {
					if (message.match(/^(http(s)?[:][\\/][\\/])?pastebin[.]com/gm)) {
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
								console.error(error);
								await interaction.reply({
									content:
										"Something was messed up, double check your Pastebin URL",
									ephemeral: true
								});
							});
					} else if (
						message.match(
							/^(http(s))?[:][\\/][\\/]docs[.]google[.]com[\\/]spreadsheets[\\/]*/gm
						)
					) {
						await interaction.reply({
							content:
								"Stage 1/2\n[ ] Taking screenshot...\n[ ] Upload to Imgur",
							ephemeral: true
						});
						const captureWebsite = await (Function(
								"return import('capture-website')"
							)() as Promise<typeof import("capture-website")>),
							imgurClient = new ImgurClient({
								clientId: process.env.IMGUR_CLIENT_ID,
								clientSecret: process.env.IMGUR_CLIENT_SECRET
							});

						await captureWebsite.default
							.file(message, "dcr.png", {
								element: "#docs-editor-container",
								hideElements: ["div[role='navigation']"],
								launchOptions: {
									args: ["--no-sandbox", "--disable-setuid-sandbox"]
								}
							})
							.then(() =>
								interaction.editReply(
									"Stage 2/2\n[x] Taken screenshot\n[ ] Uploading to Imgur..."
								)
							);
						await imgurClient
							.upload({
								image: fs.createReadStream(
									"test.png"
								) as unknown as ReadableStream,
								type: "stream"
							})
							.then(async response => {
								await editMessage.edit(
									`DaCoolReminder (as of ${new Date(
										Date.now() + 7 * 3600 * 1000
									).toLocaleString("en-US", {
										weekday: "long",
										month: "long",
										day: "numeric",
										year: "numeric"
									})})\n${response.data.link}`
								);
								await interaction.editReply("Successfully edited message");
								fs.rmSync("test.png", {
									force: true
								});
							})
							.catch(async error => {
								console.error(error);
								await interaction.editReply("Failed to upload to Imgur");
							});
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
};
