import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import path from "node:path"
import SlashCommand from "./commands/command.ts";
import { importTeamCommand } from "./commands/import_team.ts";

config({path: path.resolve(".env")})

const rest = new REST({version: "10"}).setToken(process.env.DISCORD_TOKEN as string);

export async function reloadSlashCommandsDev() {
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID as string, process.env.DISCORD_GUILD_ID as string),
            {
                body: [
                    importTeamCommand
                ].map((command: SlashCommand) => command.builder.toJSON())
            }
        )

        console.log("Successfully reloaded application commands")
    } catch (error) {
        console.error(error)
    }
}