import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { save } from "../hooks/usePersist";
import DiffDots from "../components/DiffDots";
import Tag from "../components/Tag";

const VICTORIES = ["Short", "Long", "Ultimate"];
const VICTORY_COLORS = { Short: "#facc15", Long: "#4ade80", Ultimate: "#c084fc" };

const isDone = (val) => val?.done ?? !!val;
const getVictory = (val) => val?.victory ?? null;

export default function AllFactions({ roadmap, checked, setChecked, activeCampaign, setActiveCampaign }) {
    const t = useTheme();
    const [filter, setFilter] = useState("alle");
    const [sortBy, setSortBy] = useState("tier");
    const [victoryModal, setVictoryModal] = useState(null);

    const allEntries = roadmap.flatMap((tier) =>
        tier.entries.map((e) => ({ ...e, tierColor: tier.tierColor, tierLabel: tier.tierLabel }))
    );
    const getKey = (entry) => {
        const tier = roadmap.find((r) => r.tier === entry.tier);
        return `${entry.tier}-${tier.entries.findIndex((x) => x.id === entry.id)}`;
    };

    const completeWithVictory = (key, victory) => {
        setChecked((p) => {
            const n = { ...p, [key]: { done: true, victory } };
            save("tww3_checked", n);
            return n;
        });
        setVictoryModal(null);
    };

    const uncomplete = (key) => {
        setChecked((p) => {
            const n = { ...p, [key]: { done: false, victory: null } };
            save("tww3_checked", n);
            return n;
        });
    };

    let entries = allEntries.filter((e) => {
        const done = isDone(checked[getKey(e)]);
        if (filter === "offen") return !done;
        if (filter === "fertig") return done;
        if (filter === "leicht") return e.difficulty <= 2;
        if (filter === "schwer") return e.difficulty >= 4;
        return true;
    });
    if (sortBy === "tier") entries = [...entries].sort((a, b) => a.tier - b.tier);
    if (sortBy === "difficulty") entries = [...entries].sort((a, b) => a.difficulty - b.difficulty);
    if (sortBy === "fun") entries = [...entries].sort((a, b) => b.funFactor - a.funFactor);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

            {victoryModal && (
                <div onClick={() => setVictoryModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 14, padding: "30px 36px", minWidth: 340, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", textAlign: "center" }}>
                        <div style={{ fontSize: 28, marginBottom: 10 }}>🏆</div>
                        <div style={{ fontSize: 10, letterSpacing: 4, color: t.text4, textTransform: "uppercase", marginBottom: 6 }}>Campaign Complete</div>
                        <div style={{ fontSize: 18, color: t.text1, marginBottom: 4 }}>{victoryModal.faction}</div>
                        <div style={{ fontSize: 13, color: t.text4, marginBottom: 22 }}>Which victory did you achieve?</div>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            {VICTORIES.map(v => (
                                <button key={v} onClick={() => completeWithVictory(victoryModal.key, v)} style={{ fontSize: 13, padding: "10px 20px", borderRadius: 8, cursor: "pointer", background: `${VICTORY_COLORS[v]}18`, border: `1px solid ${VICTORY_COLORS[v]}60`, color: VICTORY_COLORS[v], fontFamily: "inherit" }}>{v}</button>
                            ))}
                        </div>
                        <button onClick={() => setVictoryModal(null)} style={{ marginTop: 16, fontSize: 12, color: t.text4, background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    </div>
                </div>
            )}

            <div style={{ padding: "13px 34px", borderBottom: `1px solid ${t.border}`, display: "flex", gap: 10, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 5, flex: 1, flexWrap: "wrap" }}>
                    {[["alle", "All"], ["offen", "Open"], ["fertig", "Done"], ["leicht", "Easy (1-2)"], ["schwer", "Hard (4-5)"]].map(([id, lbl]) => (
                        <button key={id} onClick={() => setFilter(id)} style={{ fontSize: 11, padding: "5px 12px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", background: filter === id ? t.accentGlow : "transparent", border: `1px solid ${filter === id ? t.accent : t.border}`, color: filter === id ? t.accent : t.text3, transition: "all 0.15s" }}>{lbl}</button>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                    {[["tier", "Tier"], ["difficulty", "Difficulty"], ["fun", "Fun Factor"]].map(([id, lbl]) => (
                        <button key={id} onClick={() => setSortBy(id)} style={{ fontSize: 11, padding: "5px 11px", borderRadius: 5, cursor: "pointer", fontFamily: "inherit", background: sortBy === id ? t.bg3 : "transparent", border: `1px solid ${t.border}`, color: sortBy === id ? t.text2 : t.text3 }}>{lbl}</button>
                    ))}
                </div>
                <span style={{ fontSize: 11, color: t.text4 }}>{entries.length} Factions</span>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "14px 34px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "24px 165px 150px 108px 86px 76px 1fr 140px", gap: 10, padding: "6px 10px", fontSize: 9, letterSpacing: 2, color: t.text4, textTransform: "uppercase", borderBottom: `1px solid ${t.border}`, marginBottom: 4 }}>
                    <div /><div>Faction</div><div>Lord</div><div>Tier</div><div>Diff.</div><div>Length</div><div>Tags</div><div>Status</div>
                </div>
                {entries.map((e) => {
                    const key = getKey(e);
                    const done = isDone(checked[key]);
                    const victory = getVictory(checked[key]);
                    const isPlaying = activeCampaign === e.id;
                    return (
                        <div key={e.id} style={{ display: "grid", gridTemplateColumns: "24px 165px 150px 108px 86px 76px 1fr 140px", gap: 10, padding: "10px 10px", alignItems: "center", borderBottom: `1px solid ${t.border}`, background: isPlaying ? `${e.tierColor}08` : "transparent", opacity: done ? 0.58 : 1, borderRadius: 5 }}>
                            <div onClick={() => { if (done) { uncomplete(key); } else { setVictoryModal({ key, faction: e.faction }); } }} style={{ width: 20, height: 20, borderRadius: 4, cursor: "pointer", border: `1px solid ${done ? "#4ade80" : t.inputBorder}`, background: done ? "rgba(74,222,128,0.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#4ade80" }}>{done && "✓"}</div>
                            <div style={{ fontSize: 13, color: done ? t.text5 : t.text1, textDecoration: done ? "line-through" : "none" }}>{e.faction}</div>
                            <div style={{ fontSize: 12, color: e.tierColor }}>{e.lord}</div>
                            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: `${e.tierColor}18`, color: e.tierColor, border: `1px solid ${e.tierColor}30`, whiteSpace: "nowrap", justifySelf: "start" }}>{e.tierLabel}</span>
                            <DiffDots value={e.difficulty} color={e.tierColor} />
                            <div style={{ fontSize: 12, color: t.text3 }}>{e.length}</div>
                            <div style={{ display: "flex", gap: 4 }}>{e.tags.slice(0, 2).map((tag) => <Tag key={tag} label={tag} color={e.tierColor} />)}</div>
                            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                                {done && victory && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 10, background: `${VICTORY_COLORS[victory]}18`, color: VICTORY_COLORS[victory], border: `1px solid ${VICTORY_COLORS[victory]}40`, whiteSpace: "nowrap" }}>🏆 {victory}</span>}
                                <button onClick={() => { const n = isPlaying ? null : e.id; save("tww3_activeCampaign", n); setActiveCampaign(n); }} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 5, cursor: "pointer", background: isPlaying ? `${e.tierColor}20` : "transparent", border: `1px solid ${isPlaying ? e.tierColor + "60" : t.border}`, color: isPlaying ? e.tierColor : t.text4, fontFamily: "inherit" }}>{isPlaying ? "▶ Active" : "▷ Start"}</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}