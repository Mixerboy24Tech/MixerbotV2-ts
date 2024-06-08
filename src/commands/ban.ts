import { CommandInteraction, SlashCommandBuilder, PermissionsBitField } from "discord.js";

const data = new SlashCommandBuilder()
	.setName('esta')
	.setDescription('Porttikiellon määrääminen')
	.addUserOption(option =>
		option
			.setName('jäsen')
			.setDescription('Kuka jäsen heitetään pihalle?')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);