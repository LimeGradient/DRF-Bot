import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import SlashCommand from "./command.ts";
import fs from "node:fs"
import { parseTeam, type Pokemon } from "../showdown/parser.ts";
import { webhookClient } from "../index.ts";

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

        if (attachedFile) {
            const response = await fetch(attachedFile.url);
            const data = await response.text();
            const team = parseTeam(data) as Pokemon[]

            const teamFields = team.map((pokemon) => {
                return {
                    name: pokemon.nickname as string,
                    value: `Pokemon: ${pokemon.species}`
                }
            })

            webhookClient.send({
                content: `<@${interaction.user.id}> just imported their team!`,
                username: "DRF Team Tracker",
                avatarURL: "https://preview.redd.it/no-spoilers-does-chloe-price-truly-deserve-all-the-hate-v0-sdclqpd2co851.jpg?width=640&crop=smart&auto=webp&s=c6245080626897c95c36b0c5639a5b57274fb63f",
                embeds: [
                    {
                        fields: teamFields,
                        author: {
                            name: `${interaction.user.displayName}'s Team`,
                            icon_url: interaction.user.avatarURL() as string
                        }
                    }
                ]
            })
            .then(() => {
                interaction.reply({
                    content: "Your team was successfully imported!",
                    flags: MessageFlags.Ephemeral
                })
            })
            .catch(console.error)
        }
    }
}

export const importTeamCommand = new ImportTeamCommand()