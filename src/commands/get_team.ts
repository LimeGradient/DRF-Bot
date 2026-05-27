import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import SlashCommand from "./command.ts";
import { database } from "../util.ts";
import type { Pokemon } from "../showdown/parser.ts";

export default class GetTeamCommand extends SlashCommand {
    constructor() {
        super()

        const command = new SlashCommandBuilder()
            .setName("get_team")
            .setDescription("Import your Pokemon Showdown team!")
            .addUserOption(option => 
                option.setName("target")
                    .setDescription("The player whos team you want to get")
                    .setRequired(true)
            ) as SlashCommandBuilder

        this.build(
            command,
            this.runCommand
        )
    }

    runCommand(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('target');

        if (user) {
            const team = database.prepare("SELECT * FROM teams WHERE id = ?").get(user.id) as Pokemon
            console.log(team)
        }
    }
}

export const getTeamCommand = new GetTeamCommand()