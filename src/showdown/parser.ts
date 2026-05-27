export interface Pokemon {
    nickname: string;
    species: string;
    gender: string | null;
    item: string | null;
    ability: string | null;
    shiny: boolean;
    teraType: string | null;
    evs: Record<string, number>;
    ivs: Record<string, number>;
    nature: string | null;
    moves: string[];
}

function parseStatLine(line: string): Record<string, number> {
    const stats: Record<string, number> = {};
    const parts = line.split("/").map(s => s.trim());
    for (const part of parts) {
        const match: any = part.match(/^(\d+)\s+(\w+)$/);
        if (match) {
            stats[match[2]] = parseInt(match[1], 10);
        }
    }
    return stats;
}

function parsePokemon(block: string): Pokemon {
    const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);

    const pokemon: Pokemon = {
        nickname: "",
        species: "",
        gender: null,
        item: null,
        ability: null,
        shiny: false,
        teraType: null,
        evs: {},
        ivs: {},
        nature: null,
        moves: [],
    };

    // Parse header line: "Nickname (Species) (Gender) @ Item"
    // or "Species @ Item", "Species (Gender) @ Item", etc.
    const headerLine: any = lines[0];
    const headerMatch = headerLine.match(
        /^(.+?)\s*(?:\(([MF])\))?\s*(?:@\s*(.+))?$/
    );

    if (headerMatch) {
        const nameAndSpecies = headerMatch[1].trim();
        pokemon.item = headerMatch[3]?.trim() ?? null;
        pokemon.gender = headerMatch[2] ?? null;

        // Extract species from parentheses if nickname is present
        const speciesMatch = nameAndSpecies.match(/^(.*?)\s*\(([^MF][^)]*)\)\s*$/);
        if (speciesMatch) {
            pokemon.nickname = speciesMatch[1].trim();
            pokemon.species = speciesMatch[2].trim();
        } else {
            pokemon.nickname = nameAndSpecies;
            pokemon.species = nameAndSpecies;
        }
    }

    // Parse remaining lines
    for (let i = 1; i < lines.length; i++) {
        const line: any = lines[i];

        if (line.startsWith("Ability:")) {
            pokemon.ability = line.slice("Ability:".length).trim();
        } else if (line.startsWith("Shiny:")) {
            pokemon.shiny = line.slice("Shiny:".length).trim().toLowerCase() === "yes";
        } else if (line.startsWith("Tera Type:")) {
            pokemon.teraType = line.slice("Tera Type:".length).trim();
        } else if (line.startsWith("EVs:")) {
            pokemon.evs = parseStatLine(line.slice("EVs:".length).trim());
        } else if (line.startsWith("IVs:")) {
            pokemon.ivs = parseStatLine(line.slice("IVs:".length).trim());
        } else if (line.endsWith("Nature")) {
            pokemon.nature = line.replace("Nature", "").trim();
        } else if (line.startsWith("- ")) {
            pokemon.moves.push(line.slice(2).trim());
        }
    }

    return pokemon;
}

export function parseTeam(input: string): Pokemon[] {
    const blocks = input.trim().split(/\n\s*\n/);
    return blocks.filter(b => b.trim()).map(parsePokemon);
}