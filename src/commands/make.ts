import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, GuildMemberRoleManager, Interaction } from "discord.js";
import axios from "axios";
import capturewebsite from "capture-website";
import fs from "node:fs";
import pkg from "imgur";
const ImgurClient = pkg;

export default {
	data: new SlashCommandBuilder()
		.setName("make")
		.setDescription("Make a new reminder message")
		.addStringOption(option =>
			option
				.setName("message")
				.setDescription(
					"(Pastebin / Google Spreadsheet URL containing) reminder message content"
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
			if (
				!message.match(
					/^(http(s))?[:][\\/][\\/]docs[.]google[.]com[\\/]spreadsheets[\\/]*/gm
				)
			) {
				if (message.match(/^(http(s)?[:][\\/][\\/])?pastebin[.]com/gm)) {
					const pastebin = message.split("/");
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
				} else await interaction.reply(message);
			} else {
				const client = new ImgurClient({
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET
				});

				await interaction.reply("Taking screenshot...");

				await capturewebsite
					.file(message, "dcr-ss.png", {
						element: "#docs-editor-container",
						hideElements: ["div[role='navigation']"]
					})
					.catch(async error => {
						console.error(error);
						await interaction.reply("Error occurred");
						return;
					});

				await interaction.editReply("Sending screenshot to Imgur...");

				const { data } = await client.upload({
					image: fs.createReadStream("dcr-ss.png") as unknown as ReadableStream,
					type: "stream"
				});

				await interaction.reply(data.link);

				fs.unlink("dcr-ss.png", function (err) {
					if (err && err.code === "ENOENT")
						console.info("File doesn't exist, won't remove it.");
					else if (err)
						console.error("Error occurred while trying to remove file");
					else console.info("Removed");
				});
			}

			if (options.getBoolean("mention")) {
				let mentionMsg = `@everyone DaCoolReminder is updated for ${new Date(
					Date.now() + 7 * 3600 * 1000
				).toLocaleString("en-US", {
					weekday: "long",
					month: "long",
					day: "numeric"
				})}`;
				if (note) mentionMsg = `${mentionMsg} (${note})`;

				await channel.send(mentionMsg);
			}
		} else
			await interaction.reply({ content: "lmao no perms", ephemeral: true });
	}
};
