import axios from "axios";
import { Client, GuildMemberRoleManager, Intents } from "discord.js";
import { token } from "./config.json";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  client.user!.setPresence({
    activities: [{ name: "your mom" }],
    status: "idle",
  });
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  console.log(interaction);

  const { commandName, member, options } = interaction;

  switch (commandName) {
    case "reminder":
      if (
        !(member.roles as GuildMemberRoleManager).cache.some(
          (role) => role.name === "DaCoolCorp™"
        )
      ) {
        await interaction.reply({ content: "lmao no perms", ephemeral: true });
      } else if (interaction.channelId !== "785492392606040094") {
        await interaction.reply({
          content: "wrong channel buffoon",
          ephemeral: true,
        });
      } else {
        // For later when am smart
        /* const reminderEmbed = new MessageEmbed()
          .setColor(user.hexAccentColor)
          .setAuthor({
            name: `Updated by: ${user.tag}`,
            iconURL: user.avatarURL({ size: 4096 }),
          })
          .setTitle("DaCoolReminder™")
          .setDescription(
            `as of ${today.getDate()} / ${today.getMonth()} / ${today.getFullYear()}`
          )
          .setTimestamp(); */
        const messageContent = options.getString("message");
        await interaction.reply(messageContent);
      }
      break;
    case "edit": {
      const id = options.getString("id");
      const pastebin = options.getString("pastebin").split("/");
      const editMessage = interaction.channel.messages.fetch(id);
      if (!editMessage) {
        await interaction.reply({
          content: "Reminder message with given ID is not found",
          ephemeral: true,
        });
      } else {
        axios
          .get(`https://pastebin.com/raw/${pastebin[pastebin.length - 1]}`)
          .then(async (response) => {
            console.log(response.data);
            (await editMessage).edit(response.data);
            await interaction.reply({
              content: "Successfully edited reminder message",
              ephemeral: true,
            });
          })
          .catch(async (error) => {
            console.log(error);
            await interaction.reply({
              content:
                "Something was messed up, double check your Pastebin URL",
              ephemeral: true,
            });
          });
      }
    }
  }
});

client.login(token);
