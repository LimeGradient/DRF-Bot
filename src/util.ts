import Database from "better-sqlite3"
import path from "node:path"
import type {Database as BetterDatabase} from "better-sqlite3"

export const database: BetterDatabase = new Database(path.resolve("db/database.db"))
export const adminRoleID = "1509337948678652034"

export interface DRFUser {
    userID: string,
    score: string
}

export function getUsersScore(userID: string) {
    const user = database.prepare("SELECT * FROM users WHERE userID = ?").get(userID) as DRFUser
    return user.score
}