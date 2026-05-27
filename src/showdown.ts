import { WebSocket } from "ws"

const ws = new WebSocket("wss://sim3.psim.us/showdown/websocket")
const BATTLE_ID = "battle-gen9nationaldexdoublesubers-2618088747"

ws.on("open", () => {
    console.log("Connected to Pokemon Showdown")
})

ws.on("message", (raw: string) => {
    const data = raw.toString();
    const lines: any = data.split("\n");
    console.log(data)

    let roomId = "";
    if (lines[0].startsWith(">")) {
        roomId = lines[0].slice(1).trim();
    }

    for (const line of lines) {
        if (!line.startsWith("|")) continue;
        handleBattleMessage(line, roomId);
    }
});

ws.on("message", (raw: string) => {
    if (raw.toString().includes("|challstr|")) {
        // Join battle room as observer (no login required for public battles)
        ws.send(`|/join ${BATTLE_ID}`);
    }
});

function handleBattleMessage(line: string, roomId: string) {
    const parts = line.split("|");
    const type = parts[1];

    switch (type) {
        case "turn":
            console.log(`\n=== Turn ${parts[2]} ===`);
            break;
        case "move":
            // |move|POKEMON|MOVE|TARGET
            console.log(`${parts[2]} used ${parts[3]}!`);
            break;
        case "switch":
            // |switch|POKEMON|DETAILS|HP
            console.log(`Switched in: ${parts[2]} (${parts[3]}) HP: ${parts[4]}`);
            break;
        case "-damage":
            // |-damage|POKEMON|HP STATUS
            console.log(`${parts[2]} took damage → ${parts[3]}`);
            break;
        case "-heal":
            console.log(`${parts[2]} healed → ${parts[3]}`);
            break;
        case "faint":
            console.log(`${parts[2]} fainted!`);
            break;
        case "win":
            console.log(`Winner: ${parts[2]}`);
            break;
        case "tie":
            console.log("It's a tie!");
            break;
    }
}