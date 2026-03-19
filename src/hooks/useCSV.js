import { useState, useEffect } from "react";
import Papa from "papaparse";

export default function useCSV(path) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(path)
            .then((response) => response.text())
            .then((text) => {
                const result = Papa.parse(text, {
                    header: true,
                    skipEmptyLines: true,
                });
                setData(result.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [path]);

    return { data, loading, error };
}

export function buildStyles(csvRows) {
    const map = {};
    csvRows.forEach((row) => {
        map[row.id] = {
            id: row.id,
            label: row.label,
            icon: row.icon,
            color: row.color,
        };
    });
    return map;
}

export function buildRoadmap(csvRows, stylesMap = {}) {
    const entries = csvRows.map((row) => {
        const styleIds = row.style ? row.style.split(";").map(s => s.trim()) : [];
        const styles = styleIds.map(id => stylesMap[id] ?? { id, label: id, icon: "", color: null });
        return {
            ...row,
            difficulty: parseInt(row.difficulty, 10),
            tier: parseInt(row.tier, 10),
            tags: row.tags ? row.tags.split(";").map((t) => t.trim()) : [],
            length: row.length?.trim(),
            pressure: row.pressure?.trim(),
            game: row.game?.trim(),
            styleIds,
            styles,
            styleLabel: styles.map(s => s.label).join(" / "),
            styleIcon: styles[0]?.icon ?? "",
        };
    });

    const tierNums = [...new Set(entries.map((e) => e.tier))].sort((a, b) => a - b);

    return tierNums.map((tierNum) => {
        const tierEntries = entries.filter((e) => e.tier === tierNum);
        const first = tierEntries[0];
        return {
            tier: tierNum,
            tierLabel: first.tierLabel,
            tierColor: first.tierColor,
            tierBg: `${first.tierColor}14`,
            entries: tierEntries,
        };
    });
}

export function buildRaces(csvRows) {
    const raceMap = {};

    csvRows.forEach((row) => {
        if (!raceMap[row.race]) {
            raceMap[row.race] = {
                race: row.race,
                icon: row.icon,
                game: row.game,
                color: row.color,
                lords: [],
            };
        }

        raceMap[row.race].lords.push({
            id: row.lordId,
            name: row.lordName,
            dlc: row.lorddlc,
        });
    });

    return Object.values(raceMap);
}