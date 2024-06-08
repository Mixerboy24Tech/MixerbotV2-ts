import { Client, VoiceChannel } from "discord.js";
import { config } from "../config";

const MEMBER_ROLE_ID = '513445707475058701';
const VOICE_CHANNEL_ID = '1249099622396203140';

export async function paivitaJasenet(client: Client) {
  try {
    const guild = client.guilds.cache.get(config.palvelinID);
    if (!guild) {
      console.error('Palvelinta ei ole.');
      return;
    }

    // Fetch all members
    await guild.members.fetch();

    const memberCount = guild.members.cache.filter(member => member.roles.cache.has(MEMBER_ROLE_ID)).size;

    const voiceChannel = guild.channels.cache.get(VOICE_CHANNEL_ID) as VoiceChannel;
    if (!voiceChannel) {
      console.error('Äänikanavaa ei löydy!');
      return;
    }

    await voiceChannel.setName(`Jäseniä: ${memberCount}`);
    console.log(`Määrä päivitetty: Jäseniä: ${memberCount}`);
  } catch (error) {
    console.error('Virhe määrittäessä lukua:', error);
  }
}
