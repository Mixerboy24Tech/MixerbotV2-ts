import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import * as fs from "fs/promises";
import SFTPClient from 'ssh2-sftp-client';
import * as path from "path";
import { config } from "../config";

const whitelistFilePath = path.join('src/filut/whitelist.json');
const palvelin = new SFTPClient();

interface WhitelistEntry {
  id: string;
  name: string;
}

export const data = new SlashCommandBuilder()
  .setName("whitelist")
  .setDescription("Lisää pelaajan MC Whitelistille")
  .addStringOption(option =>
    option.setName("playername")
      .setDescription("Nimimerkki Minecraftissa")
      .setRequired(true)
  );

async function tarkistaPelaajanimi(pelaajanimi: string): Promise<WhitelistEntry | null> {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${pelaajanimi}`);
  if (response.status === 200) {
    const data: unknown = await response.json();

    if (typeof data === "object" && data !== null && "id" in data && "name" in data) {
      const { id, name } = data as { id: string; name: string };
      return { id: formatUUID(id), name };
    } else {
      throw new Error("Virheellinen vastaus Mojangin API:lta");
    }
  }
  return null;
}

// Lisätään UUID oikeaan muotoon. API antaa UUID:n ilman viivoja. 
function formatUUID(uuid: string): string {
  return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
}

async function lisaaWhitelistille(pelaaja: WhitelistEntry) {
  try {
    // Tarkistetaan, onko tiedosto olemassa
    await fs.access(whitelistFilePath);
  } catch (error) {
    // Tiedostoa ei ole olemassa, luodaan uusi
    await fs.writeFile(whitelistFilePath, JSON.stringify([]), "utf8");
  }

  try {
    const data = await fs.readFile(whitelistFilePath, "utf8");
    const whitelist: WhitelistEntry[] = JSON.parse(data);

    if (whitelist.some(entry => entry.id === pelaaja.id)) {
      throw new Error("Pelaaja on jo whitelistillä.");
    }

    whitelist.push(pelaaja);
    await fs.writeFile(whitelistFilePath, JSON.stringify(whitelist, null, 2), "utf8");
    await kirjoitaPalvelimelle(whitelist);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Virhe käsiteltäessä pyyntöä: " + error.message);
    } else {
      throw new Error("Tuntematon virhe käsiteltäessä pyyntöä");
    }
  }
}

async function kirjoitaPalvelimelle(whitelist: WhitelistEntry[]) {
  try {
    await palvelin.connect({
      host: config.host,
      port: config.port,
      username: config.tunnus,
      password: config.password,
    });

    const remoteFilePath = "/whitelist.json";
    await palvelin.put(Buffer.from(JSON.stringify(whitelist, null, 2)), remoteFilePath);
    console.log(`Whitelist päivitetty ${remoteFilePath}`);
  } catch (err) {
    console.error('SFTP upload error:', err);
  } finally {
    palvelin.end();
  }
}

export async function execute(interaction: CommandInteraction) {
  const allowedChannelId = "1183124743516323932";
  const roleId = "785060894735990784";

  if (interaction.channelId !== allowedChannelId) {
    return interaction.reply("Tätä komentoa voi käyttää vain määrätyllä kanavalla.");
  }

  const pelaajanimi = interaction.options.get("playername")?.value as string;

  if (!pelaajanimi) {
    return interaction.reply("Pelaajan nimi puuttuu.");
  }

  const pelaaja = await tarkistaPelaajanimi(pelaajanimi);
  if (!pelaaja) {
    return interaction.reply(`Pelaajaa nimeltä **${pelaajanimi}** ei löydy Mojangin tietokannasta.`);
  }

  try {
    await lisaaWhitelistille(pelaaja);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return interaction.reply(error.message);
    } else {
      return interaction.reply("Tuntematon virhe. Kutsutaan <@375172264666071040> paikalle");
    }
  }

  const member = interaction.guild?.members.cache.get(interaction.user.id);
  if (member) {
    await member.roles.add(roleId);
    return interaction.reply(`Pelaaja **${pelaajanimi}** on lisätty whitelistille`);
  } else {
    return interaction.reply("Roolin lisäämisessä tapahtui virhe. Kutsutaan <@375172264666071040> paikalle");
  }
}
