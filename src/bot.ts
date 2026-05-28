import { Client, Events, GatewayIntentBits, WebhookClient } from "discord.js"
import { importTeamCommand } from "./commands/import_team.ts"
import type SlashCommand from "./commands/command.ts"
import { getTeamCommand } from "./commands/get_team.ts"
import { createBattleCommand } from "./commands/create_battle.ts"
import { initializeCommand } from "./commands/initialize.ts"

class ExtendedClient extends Client {
    commands: SlashCommand[] = []
}

export default class Bot {
    private token: string
    private client: ExtendedClient

    constructor(token: string) {
        this.token = token
        this.client = new ExtendedClient({ intents: [ 
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers
        ]})

        this.client.commands.push(importTeamCommand)
        this.client.commands.push(getTeamCommand)
        this.client.commands.push(createBattleCommand)
        this.client.commands.push(initializeCommand)

        this.client.once(Events.ClientReady, (readyClient) => {
            console.log(`Ready! Logged in as ${readyClient.user.tag}`);
        });

        this.client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand()) return

            this.client.commands.forEach(async (command) => {
                if (interaction.commandName === command.builder.name) {
                    await command.execute(interaction)
                }
            })
        })
    }

    start() {
        this.client.login(this.token)
    }
}