import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { save } from "../hooks/usePersist";
import DiffDots from "../components/DiffDots";
import Tag from "../components/Tag";
import PressureBadge from "../components/PressureBadge";

const VICTORIES = ["Short", "Long", "Ultimate"];
const VICTORY_COLORS = { Short: "#facc15", Long: "#4ade80", Ultimate: "#c084fc" };

const isDone = (val) => val?.done ?? !!val;
const getVictory = (val) => val?.victory ?? null;

export default function RoadmapView({ roadmap, checked, setChecked, activeCampaign, setActiveCampaign, activeTier, setActiveTier }) {
    const t = useTheme();
    const [openEntry, setOpenEntry] = useState(null);
    const [victoryModal, setVictoryModal] = useState(null);

    const tier = roadmap.find((r) => r.tier === activeTier) || roadmap[0];
    if (!tier) return null;

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
                                <button key={v} onClick={() => completeWithVictory(victoryModal.key, v)} style={{ fontSize: 13, padding: "10px 20px", borderRadius: 8, cursor: "pointer", background: `${VICTORY_COLORS[v]}18`, border: `1px solid ${VICTORY_COLORS[v]}60`, color: VICTORY_COLORS[v], fontFamily: "inherit", transition: "all 0.15s" }}>{v}</button>
                            ))}
                        </div>
                        <button onClick={() => setVictoryModal(null)} style={{ marginTop: 16, fontSize: 12, color: t.text4, background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    </div>
                </div>
            )}

            <div style={{ padding: "15px 34px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 14, background: t.topbar, flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: tier.tierBg, border: `1px solid ${tier.tierColor}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: "bold", color: tier.tierColor }}>{tier.tier}</div>
                <div>
                    <div style={{ fontSize: 10, letterSpacing: 4, color: tier.tierColor, textTransform: "uppercase" }}>Tier {tier.tier}</div>
                    <div style={{ fontSize: 21, color: t.text1, fontWeight: "normal", lineHeight: 1 }}>{tier.tierLabel}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                    {roadmap.map((r) => (
                        <div key={r.tier} onClick={() => { setActiveTier(r.tier); setOpenEntry(null); }} style={{ width: activeTier === r.tier ? 26 : 8, height: 8, borderRadius: 4, background: activeTier === r.tier ? r.tierColor : t.dots, cursor: "pointer", transition: "all 0.25s" }} />
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "22px 34px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, alignContent: "start" }}>
                {tier.entries.map((entry, i) => {
                    const key = `${tier.tier}-${i}`;
                    const isOpen = openEntry === key;
                    const done = isDone(checked[key]);
                    const victory = getVictory(checked[key]);
                    const isPlaying = activeCampaign === entry.id;
                    const cl = tier.tierColor;

                    return (
                        <div key={key} onClick={() => setOpenEntry(isOpen ? null : key)} style={{
                            background: isPlaying ? `${cl}0d` : done ? (t.name === "dark" ? "rgba(74,222,128,0.04)" : "rgba(74,222,128,0.09)") : isOpen ? tier.tierBg : t.bg3,
                            border: `1px solid ${done ? "rgba(74,222,128,0.22)" : isOpen ? cl + "55" : t.border}`,
                            borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
                            opacity: done ? 0.65 : 1, display: "flex", flexDirection: "column", overflow: "hidden",
                            ...(isOpen ? { gridColumn: "1 / -1" } : {}),
                        }}>
                            <div style={{ height: 2, background: isOpen || isPlaying ? `${cl}70` : `${cl}30`, flexShrink: 0 }} />
                            <div style={{ padding: isOpen ? "20px 22px" : "15px 16px", flex: 1 }}>

                                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 9 }}>
                                    <div onClick={(e) => { e.stopPropagation(); if (done) { uncomplete(key); } else { setVictoryModal({ key, faction: entry.faction }); } }} style={{ width: 21, height: 21, borderRadius: 4, flexShrink: 0, border: `1px solid ${done ? "#4ade80" : t.inputBorder}`, background: done ? "rgba(74,222,128,0.18)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#4ade80", transition: "all 0.2s", marginTop: 2, cursor: "pointer" }}>{done && "✓"}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2, flexWrap: "wrap" }}>
                                            <span style={{ fontSize: isOpen ? 19 : 15, color: done ? t.text5 : t.text1, textDecoration: done ? "line-through" : "none" }}>{entry.faction}</span>
                                            {isPlaying && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 10, background: `${cl}25`, color: cl, letterSpacing: 1 }}>ACTIVE</span>}
                                            {done && victory && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 10, background: `${VICTORY_COLORS[victory]}18`, color: VICTORY_COLORS[victory], border: `1px solid ${VICTORY_COLORS[victory]}40`, letterSpacing: 1 }}>🏆 {victory}</span>}
                                        </div>
                                        <div style={{ fontSize: 12, color: cl }}>{entry.lord}</div>
                                    </div>
                                    <span style={{ fontSize: 11, color: isOpen ? cl : t.text4, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none", paddingTop: 3 }}>▼</span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                                    <DiffDots value={entry.difficulty} color={cl} />
                                    <span style={{ fontSize: 11, color: t.text3 }}>{entry.style}</span>
                                </div>
                                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                    {entry.tags.map((tag) => <Tag key={tag} label={tag} color={cl} />)}
                                    <span style={{ fontSize: 10, color: t.text4, padding: "2px 4px" }}>{entry.dlc}</span>
                                </div>

                                {isOpen && (
                                    <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 16, marginTop: 14 }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 14 }}>
                                            <div>
                                                <div style={{ fontSize: 9, letterSpacing: 3, color: t.text4, textTransform: "uppercase", marginBottom: 7 }}>Why play this</div>
                                                <p style={{ fontSize: 14, color: t.body, margin: "0 0 10px", lineHeight: 1.7 }}>{entry.why}</p>
                                                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                                                    <span style={{ fontSize: 11, color: t.text3 }}>Start pressure:</span>
                                                    <PressureBadge level={entry.pressure} />
                                                </div>
                                            </div>
                                            <div style={{ background: `${cl}08`, border: `1px solid ${cl}25`, borderRadius: 8, padding: "12px 14px" }}>
                                                <div style={{ fontSize: 9, letterSpacing: 3, color: cl, opacity: 0.75, textTransform: "uppercase", marginBottom: 7 }}>Key Mechanic</div>
                                                <p style={{ fontSize: 13, color: t.body, margin: 0, lineHeight: 1.7 }}>{entry.keyMechanic}</p>
                                            </div>
                                            <div>
                                                <div style={{ background: t.bg2, borderLeft: `3px solid ${cl}80`, borderRadius: "0 8px 8px 0", padding: "12px 14px", marginBottom: 10 }}>
                                                    <div style={{ fontSize: 9, letterSpacing: 3, color: cl, textTransform: "uppercase", marginBottom: 5 }}>Campaign Tip</div>
                                                    <p style={{ fontSize: 13, color: t.body, margin: 0, lineHeight: 1.6 }}>{entry.tip}</p>
                                                </div>
                                                <div style={{ display: "flex", gap: 7 }}>
                                                    <button onClick={(e) => { e.stopPropagation(); const n = activeCampaign === entry.id ? null : entry.id; save("tww3_activeCampaign", n); setActiveCampaign(n); }} style={{ flex: 1, fontSize: 11, padding: "6px 0", borderRadius: 6, cursor: "pointer", background: activeCampaign === entry.id ? `${cl}25` : "transparent", border: `1px solid ${cl}50`, color: cl, fontFamily: "inherit" }}>{activeCampaign === entry.id ? "▶ Active" : "▷ Start"}</button>
                                                    <button onClick={(e) => { e.stopPropagation(); if (done) { uncomplete(key); } else { setVictoryModal({ key, faction: entry.faction }); } }} style={{ flex: 1, fontSize: 11, padding: "6px 0", borderRadius: 6, cursor: "pointer", background: done ? "rgba(74,222,128,0.15)" : "transparent", border: `1px solid ${done ? "#4ade80" : t.border}`, color: done ? "#4ade80" : t.text3, fontFamily: "inherit" }}>{done ? `✓ ${victory ?? "Done"}` : "Complete"}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ flexShrink: 0, borderTop: `1px solid ${t.border}`, background: t.topbar, padding: "11px 34px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={() => { setActiveTier((v) => Math.max(1, v - 1)); setOpenEntry(null); }} disabled={activeTier === 1} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 6, padding: "6px 16px", color: activeTier === 1 ? t.text4 : t.text3, cursor: activeTier === 1 ? "default" : "pointer", fontSize: 12, fontFamily: "inherit" }}>← Previous</button>
                <span style={{ fontSize: 11, color: t.text4 }}>{tier.entries.filter((_, i) => isDone(checked[`${tier.tier}-${i}`])).length} / {tier.entries.length} in this tier</span>
                <button onClick={() => { setActiveTier((v) => Math.min(roadmap.length, v + 1)); setOpenEntry(null); }} disabled={activeTier === roadmap.length} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 6, padding: "6px 16px", color: activeTier === roadmap.length ? t.text4 : t.text3, cursor: activeTier === roadmap.length ? "default" : "pointer", fontSize: 12, fontFamily: "inherit" }}>Next →</button>
            </div>
        </div>
    );
}