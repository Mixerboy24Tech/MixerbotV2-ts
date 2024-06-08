import { Client, VoiceChannel } from "discord.js";
import { config } from "../config";

const VOICE_CHANNEL_ID = '836866339788030002';

export async function paivitaBoosters(client: Client) {
  try {
    const guild = client.guilds.cache.get(config.palvelinID);
    if (!guild) {
      console.error('Palvelinta ei ole.');
      return;
    }

    const boosterCount = guild.premiumSubscriptionCount;

    const voiceChannel = guild.channels.cache.get(VOICE_CHANNEL_ID) as VoiceChannel;
    if (!voiceChannel) {
      console.error('Äänikanavaa ei löydy!');
      return;
    }

    await voiceChannel.setName(`Boostereita: ${boosterCount}`);
    console.log(`Määrä päivitetty: Boostereita: ${boosterCount}`);
  } catch (error) {
    console.error('Virhe määrittäessä boostereita:', error);
  }
}
