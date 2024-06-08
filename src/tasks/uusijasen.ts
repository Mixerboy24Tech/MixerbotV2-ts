import { Client, TextChannel, EmbedBuilder } from 'discord.js';

const RULES_CHANNEL_ID = '738879350627106826';
const RULES_MESSAGE_ID = '1247701412230594675';
const MEMBER_ROLE_ID = '513445707475058701';
const WELCOME_CHANNEL_ID = '513445827641999371';

export async function setupWelcome(client: Client) {
    const rulesChannel = client.channels.cache.get(RULES_CHANNEL_ID) as TextChannel;

    if (rulesChannel) {
        try {
            await rulesChannel.messages.fetch(RULES_MESSAGE_ID);
            console.log('Sääntö viesti on jo!');
        } catch (error) {
            console.log('Sääntö viestiä ei löytynyt. Luodaan uusi,');

            const embed = new EmbedBuilder()
                .setTitle('Miksaaja City Rajavartiolaitos')
                .setDescription(
                    `Matkatavarat ja henkilöllisyystodistus kiitos.
                    Reagoi tähän ✅ jotta pääset pidemmälle kaupunkiin. Reagoimalla viestiin ymmärrät lakikirjan ja ymmärrät jos rikot niitä, sinulle voidaan langettaa rangaistus tai jopa karkoitus kaupungista.
                    Säännöt ovat Miksaaja Cityn laki. Jos rikot niitä, sinulle voidaan asettaa korkeimman oikeuden (Ylläpito) toimesta karkoitus tai rajoittaa toimintaasi.`
                );

            const newRulesMessage = await rulesChannel.send({ embeds: [embed] });
            await newRulesMessage.react('✅');
            console.log(`Uusi sääntöviesti on luotu. Sen viesti ID: ${newRulesMessage.id}`);
        }
    }

    client.on('guildMemberAdd', async member => {
        const welcomeChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID) as TextChannel;

        if (welcomeChannel) {
            welcomeChannel.send(`Tervetuloa Miksaaja City palvelimelle, @${member.user.username}! ⁠Säännöt kanavalla on viesti, jota reagoimalla saat "Jäsen"-roolin. Aulaan ei linkkejä tai kuvia`);
        }
    });

    client.on('messageReactionAdd', async (reaction, user) => {
        if (reaction.message.channel.id === RULES_CHANNEL_ID && reaction.emoji.name === '✅') {
            const guild = reaction.message.guild;
            if (guild) {
                const member = guild.members.cache.get(user.id);
                if (member) {
                    await member.roles.add(MEMBER_ROLE_ID);
                }
            }
        }
    });
}