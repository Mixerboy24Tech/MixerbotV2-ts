import { REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";

console.log("deploy moduuli aktiivinen")

const commandsData = Object.values(commands).map((command) => command.data.toJSON());

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
      {
        body: commandsData,
      }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deploying commands:", error.message);
    } else {
      console.error("Unknown error deploying commands.");
    }
  }
}
