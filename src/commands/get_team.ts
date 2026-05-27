import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import SlashCommand, { embedAuthor } from "./command.ts";
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

    async runCommand(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('target');

        if (user) {
            const team = database.prepare("SELECT * FROM teams WHERE id = ?").get(user.id) as any
            const pokemon = JSON.parse(team.pokemon as string) as Pokemon[]

            const teamFields = pokemon.map((pokemon: Pokemon) => {
                return {
                    name: pokemon.nickname as string,
                    value: `Pokemon: ${pokemon.species}`
                }
            })

            const importedTeamEmbed = new EmbedBuilder()
                .setTitle(`${interaction.user.displayName}'s Team`)
                .setAuthor(embedAuthor)
                .addFields(
                    teamFields
                )

            await interaction.reply({
                embeds: [importedTeamEmbed]
            })
        }
    }
}

export const getTeamCommand = new GetTeamCommand()