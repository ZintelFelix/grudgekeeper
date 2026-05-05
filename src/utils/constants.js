export function isDone(val) {
    return val?.done === true;
}

export function getVictory(val) {
    return val?.victory ?? null;
}

export function getKills(val) {
    return val?.kills ?? null;
}

export const VICTORIES = ["Short", "Long", "Ultimate"];
export const VICTORY_COLORS = { Short: "#facc15", Long: "#4ade80", Ultimate: "#c084fc" };
