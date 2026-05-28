import { ChatInputCommandInteraction, Collection, EmbedBuilder, GuildMember, MessageFlags, Role, SlashCommandBuilder } from "discord.js";
import SlashCommand, { embedAuthor } from "./command.ts";
import { adminRoleID, database, getUsersScore } from "../util.ts";
import type { Pokemon } from "../showdown/parser.ts";

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class CreateBattleCommand extends SlashCommand {
    constructor() {
        super()

        const command = new SlashCommandBuilder()
            .setName("create_battle")
            .setDescription("Create a battle between 2 users!")
            .addUserOption(option => 
                option.setName("first_user")
                    .setDescription("The first player")
                    .setRequired(true)
            )
            .addUserOption(option => 
                option.setName("second_user")
                    .setDescription("The second player")
                    .setRequired(true)
            ) as SlashCommandBuilder

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
                const firstUser = interaction.options.getUser('first_user');
                const secondUser = interaction.options.getUser("second_user")

                const battleID = getRandomInt(10000, 100000)

                database.prepare("INSERT INTO battles (battleID, firstUserID, secondUserID, battleData) VALUES (?, ?, ?, ?)")
                    .run(battleID, firstUser?.id, secondUser?.id, "")
                
                const createBattleEmbed = new EmbedBuilder()
                    .setTitle(`${firstUser?.displayName} VS ${secondUser?.displayName}`)
                    .setFooter({
                        text: `Battle ID: ${battleID}`
                    })
                    .setAuthor(embedAuthor)
                    .addFields(
                        [
                            {
                                name: firstUser?.displayName as string,
                                value: getUsersScore(firstUser?.id as string),
                                inline: true,
                            },
                            {
                                name: secondUser?.displayName as string,
                                value: getUsersScore(secondUser?.id as string),
                                inline: true,
                            }
                        ]
                    )
                
                await interaction.reply({
                    embeds: [createBattleEmbed]
                })
            }
        }
    }
}

export const createBattleCommand = new CreateBattleCommand()