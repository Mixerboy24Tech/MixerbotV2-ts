import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { setupWelcome } from "./tasks/uusijasen";
import { paivitaJasenet } from "./tasks/jasenet";
import { paivitaBoosters } from "./tasks/boosterit";



export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ],
});

client.once("ready", async () => {
  console.log("MixerBot on paikalla");

  if (client.user) {
    console.log(`Bot user is ready: ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: 'https://miksaaja.city', type: ActivityType.Watching }],
      status: 'dnd',
    })
  };

  await setupWelcome(client); 
  await deployCommands({ guildId: config.palvelinID });
  await paivitaJasenet(client);
  await paivitaBoosters(client);
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
  await paivitaJasenet(client);
  await paivitaBoosters(client);
});

client.on("guildMemberAdd", async () => {
  await paivitaJasenet(client);
  await paivitaBoosters(client);
});

client.on("guildMemberRemove", async () => {
  await paivitaJasenet(client);
  await paivitaBoosters(client);
});


client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  console.log(`Received command: ${interaction.commandName}`);

  const { commandName } = interaction;
  const command = commands[commandName as keyof typeof commands];
  
  if (command) {
    console.log(`Executing command: ${commandName}`);
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${commandName} command:`, error);
      await interaction.reply({ content: "There was an error executing that command!", ephemeral: true });
    }
  } else {
    console.log(`Command not found: ${commandName}`);
  }
});

client.login(config.DISCORD_TOKEN);
