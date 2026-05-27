import { config } from "dotenv";
import path from "node:path"
import Bot from "./bot.ts";
import { reloadSlashCommandsDev } from "./deploy_commands.ts";
import { WebhookClient } from "discord.js";

config({path: path.resolve(".env")})

reloadSlashCommandsDev()
export const webhookClient = new WebhookClient({url: process.env.DISCORD_WEBHOOK_URL as string})

const bot = new Bot(process.env.DISCORD_TOKEN as string)
bot.start()