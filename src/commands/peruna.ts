import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("peruna")
  .setDescription("Haukkuu perunaksi.");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Senkin peruna!");
}