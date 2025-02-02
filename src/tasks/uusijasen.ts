import { Client, TextChannel, EmbedBuilder, userMention } from 'discord.js';

const RULES_CHANNEL_ID = '1335677560402608230';
const RULES_MESSAGE_ID = '1335686585844371559';
const MEMBER_ROLE_ID = '1335677557239971861';
const WELCOME_CHANNEL_ID = '1335677560402608233';

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
            welcomeChannel.send(`Tervetuloa Miksaaja City palvelimelle, ${userMention(member.id)}! ⁠Säännöt kanavalla on viesti, jota reagoimalla saat "Jäsen"-roolin. Aulaan ei linkkejä tai kuvia`);
        }
    });

    client.on('messageReactionAdd', async (reaction, user) => {
        if (reaction.message.channel.id === RULES_CHANNEL_ID && reaction.emoji.name === '✅') {
            const guild = reaction.message.guild;
            if (guild) {
                try {
                    const member = await guild.members.fetch(user.id);
                    if (member) {
                        await member.roles.add(MEMBER_ROLE_ID);
                        console.log(`Lisättiin rooli käyttäjälle: ${member.user.tag}`);
                    }
                } catch (err) {
                    console.error(`Virhe lisätessä roolia:`, err);
                }
            }
        }
    });
}
