import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import DiffDots from "../components/DiffDots";

export default function FactionBrowser({ races, customList, setCustomList }) {
    const t = useTheme();
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState(null);

    const toggle = (raceObj, lord) => {
        const key = `${raceObj.race}::${lord.id}`;
        if (customList.some((e) => e.raceId === raceObj.race && e.lordId === lord.id)) {
            setCustomList((l) => l.filter((e) => !(e.raceId === raceObj.race && e.lordId === lord.id)));
        } else {
            setCustomList((l) => [...l, { id: key, raceId: raceObj.race, lordId: lord.id, raceName: raceObj.race, lordName: lord.name, dlc: lord.dlc, raceColor: raceObj.color, raceIcon: raceObj.icon, notes: "", done: false, added: Date.now() }]);
        }
    };

    const filtered = races.map((r) => ({
        ...r,
        lords: r.lords.filter((l) => !search || l.name.toLowerCase().includes(search.toLowerCase()) || r.race.toLowerCase().includes(search.toLowerCase())),
    })).filter((r) => r.lords.length > 0);

    const inList = races.flatMap((r) => r.lords.map((l) => ({ ...l, race: r.race, raceColor: r.color, raceIcon: r.icon }))).filter((l) => customList.some((e) => e.raceId === l.race && e.lordId === l.id));

    return (
        <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ padding: "14px 26px", borderBottom: `1px solid ${t.border}`, flexShrink: 0, display: "flex", gap: 14, alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 9, letterSpacing: 5, color: t.text4, textTransform: "uppercase", marginBottom: 3 }}>Faction Browser</div>
                        <div style={{ fontSize: 20, color: t.text1, fontWeight: "normal" }}>All Legendary Lords</div>
                    </div>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lord or race..." style={{ background: t.input, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 14px", fontSize: 13, color: t.text2, width: 230, outline: "none", fontFamily: "inherit" }} />
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "16px 26px" }}>
                    {filtered.map((race) => (
                        <div key={race.race} style={{ marginBottom: 7 }}>
                            <div onClick={() => setExpanded(expanded === race.race ? null : race.race)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", background: expanded === race.race ? `${race.color}12` : t.bg3, border: `1px solid ${expanded === race.race ? race.color + "40" : t.border}`, borderRadius: expanded === race.race ? "8px 8px 0 0" : "8px", transition: "all 0.15s" }}>
                                {race.icon && race.icon.startsWith("http") ? (
                                    <img src={race.icon} alt={race.race} style={{ width: 28, height: 28, objectFit: "contain", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} onError={(e) => { e.target.style.display = "none"; }} />
                                ) : (
                                    <span style={{ fontSize: 17 }}>{race.icon}</span>
                                )}
                                <span style={{ fontSize: 14, color: expanded === race.race ? race.color : t.text1, flex: 1 }}>{race.race}</span>
                                <span style={{ fontSize: 11, color: t.text4 }}>{race.lords.filter((l) => customList.some((e) => e.raceId === race.race && e.lordId === l.id)).length}/{race.lords.length} in list</span>
                                <span style={{ fontSize: 10, color: t.text3, transition: "transform 0.2s", transform: expanded === race.race ? "rotate(180deg)" : "none" }}>▼</span>
                            </div>
                            {expanded === race.race && (
                                <div style={{ border: `1px solid ${race.color}30`, borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
                                    {race.lords.map((lord, li) => {
                                        const sel = customList.some((e) => e.raceId === race.race && e.lordId === lord.id);
                                        return (
                                            <div key={lord.id} style={{ display: "grid", gridTemplateColumns: "26px 1fr 110px", gap: 12, padding: "10px 14px", alignItems: "center", background: sel ? `${race.color}08` : li % 2 === 0 ? t.bg3 : t.altRow, borderBottom: `1px solid ${t.border}` }}>
                                                <div onClick={() => toggle(race, lord)} style={{ width: 20, height: 20, borderRadius: 4, cursor: "pointer", border: `1px solid ${sel ? race.color : t.inputBorder}`, background: sel ? `${race.color}25` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: race.color }}>{sel && "✓"}</div>
                                                <div style={{ fontSize: 13, color: t.text1 }}>{lord.name}</div>
                                                <span style={{ fontSize: 10, color: t.text4 }}>{lord.dlc}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ width: 270, flexShrink: 0, borderLeft: `1px solid ${t.border}`, display: "flex", flexDirection: "column", background: t.sidebar }}>
                <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
                    <div style={{ fontSize: 9, letterSpacing: 3, color: t.text4, textTransform: "uppercase", marginBottom: 3 }}>My Custom List</div>
                    <div style={{ fontSize: 15, color: t.text1 }}>{inList.length} Lords selected</div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
                    {inList.length === 0 ? (
                        <div style={{ fontSize: 13, color: t.text4, fontStyle: "italic", lineHeight: 1.7, padding: "10px 0" }}>Check lords on the left to collect them here and build your own play list.</div>
                    ) : inList.map((l) => {
                        const entry = customList.find((e) => e.raceId === l.race && e.lordId === l.id);
                        return (
                            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: 4, background: t.bg3, border: `1px solid ${l.raceColor}22`, borderRadius: 7 }}>
                                <div style={{ width: 9, height: 9, borderRadius: "50%", background: l.raceColor, flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 12, color: t.text1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.name}</div>
                                    <div style={{ fontSize: 10, color: t.text4 }}>{l.race}</div>
                                </div>
                                <button onClick={() => entry && setCustomList((lst) => lst.filter((e) => e.id !== entry.id))} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.text4, fontSize: 15, padding: "0 2px", lineHeight: 1 }}>×</button>
                            </div>
                        );
                    })}
                </div>
                {inList.length > 0 && (
                    <div style={{ padding: "10px 14px", borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
                        <button onClick={() => setCustomList([])} style={{ width: "100%", background: "transparent", border: `1px solid ${t.border}`, borderRadius: 6, padding: "7px 0", color: t.text4, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Clear list</button>
                    </div>
                )}
            </div>
        </div>
    );
}