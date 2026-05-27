import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default class SlashCommand {
    builder!: SlashCommandBuilder;
    execute!: (interaction: ChatInputCommandInteraction) => void;

    build(builder: SlashCommandBuilder, execute: (interaction: ChatInputCommandInteraction) => void) {
        this.builder = builder
        this.execute = execute
    }
}

export const embedAuthor = {
    name: "DRF Team Tracker",
    iconURL: "https://cdn.lifeisstrangefans.com/uploads/media/2022/10/057-Chloe-Classic-1665082539-1721713752.jpg"
}