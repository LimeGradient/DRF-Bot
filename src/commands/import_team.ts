import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import SlashCommand from "./command.ts";
import fs from "node:fs"
import { parseTeam, type Pokemon } from "../showdown/parser.ts";
import { webhookClient } from "../index.ts";
import { database } from "../util.ts";

export default class ImportTeamCommand extends SlashCommand {
    constructor() {
        super()

        const command = new SlashCommandBuilder()
                .setName("import_team")
                .setDescription("Import your Pokemon Showdown team!")
                .addAttachmentOption(option => 
                    option.setName("showdown_team")
                        .setDescription("Your Pokemon Showdown Team File")
                        .setRequired(true)) as SlashCommandBuilder

        this.build(
            command,
            this.runCommand
        )
    }

    async runCommand(interaction: ChatInputCommandInteraction) {
        const attachedFile = interaction.options.getAttachment("showdown_team")

        if (attachedFile && attachedFile.contentType?.includes("text/plain")) {
            const response = await fetch(attachedFile.url);
            const data = await response.text();
            const team = parseTeam(data) as Pokemon[]

            const teamFields = team.map((pokemon) => {
                return {
                    name: pokemon.nickname as string,
                    value: `Pokemon: ${pokemon.species}`
                }
            })
            
            try {
                database.prepare("INSERT INTO teams (id, name, pokemon) VALUES (?, ?, ?)")
                    .run(interaction.user.id, `${interaction.user.displayName}'s Team`, JSON.stringify(team))
            } catch (error) {
                console.error(error)
            }

            const importedTeamEmbed = new EmbedBuilder()
                .setTitle(`${interaction.user.displayName} just imported their team!`)
                .setAuthor({
                    name: `${interaction.user.displayName}'s Team`,
                    iconURL: interaction.user.avatarURL() as string
                })
                .addFields(
                    teamFields
                )

            await interaction.reply({
                embeds: [importedTeamEmbed]
            })

/*             .then(async () => {
                await interaction.reply({
                    content: "Your team was successfully imported!",
                    flags: MessageFlags.Ephemeral
                })
            })
            .catch(console.error) */
        } else {
            await interaction.reply({
                content: "An unsupported file type was uploaded. To import your team:\n1. Press Export from the Teambuilder page on Pokemon Showdown\n2. Save the contents into a TXT file\n3. Upload using /import_team",
                flags: MessageFlags.Ephemeral
            })
        }
    }
}

export const importTeamCommand = new ImportTeamCommand()