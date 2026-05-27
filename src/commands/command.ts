import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default class SlashCommand {
    builder!: SlashCommandBuilder;
    execute!: (interaction: ChatInputCommandInteraction) => void;

    build(builder: SlashCommandBuilder, execute: (interaction: ChatInputCommandInteraction) => void) {
        this.builder = builder
        this.execute = execute
    }
}