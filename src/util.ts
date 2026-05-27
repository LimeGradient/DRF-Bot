import Database from "better-sqlite3"
import path from "node:path"
import type {Database as BetterDatabase} from "better-sqlite3"

export const database: BetterDatabase = new Database(path.resolve("db/database.db"))