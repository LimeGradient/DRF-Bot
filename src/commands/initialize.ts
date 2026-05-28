import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, MessageFlags, SlashCommandBuilder } from "discord.js";
import SlashCommand, { embedAuthor } from "./command.ts";
import { adminRoleID, database } from "../util.ts";
import type { Pokemon } from "../showdown/parser.ts";

export default class InitializeCommand extends SlashCommand {
    constructor() {
        super()

        const command = new SlashCommandBuilder()
            .setName("initialize_drf")
            .setDescription("Start the DRF season!")

        this.build(
            command,
            this.runCommand
        )
    }

    async runCommand(interaction: ChatInputCommandInteraction) {
        if (interaction.member instanceof GuildMember) {
            const hasRole = interaction.member.roles.cache.has(adminRoleID)
            if (!hasRole) {
                await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: "You do not have the required role to run this command!"
                })
            } else {
                if (!interaction.guild) return

                try {
                    const members = await interaction.guild?.members.fetch()
                    members.forEach((member) => {
                        database.prepare("INSERT INTO users (userID, score) VALUES (?, ?)").run(member.id, "0 - 0")  
                    })

                    await interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        content: "Initialized the DRF! Have Fun!"
                    })
                } catch (error) {
                    console.error(`Error fetching members: ${error}`)
                }
            }
        }
    }
}

export const initializeCommand = new InitializeCommand()