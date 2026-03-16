import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const VICTORIES = ["Short", "Long", "Ultimate"];
const VICTORY_COLORS = { Short: "#facc15", Long: "#4ade80", Ultimate: "#c084fc" };

export default function MyList({ customList, setCustomList }) {
    const t = useTheme();
    const [noteTarget, setNoteTarget] = useState(null);
    const [noteText, setNoteText] = useState("");
    const [randomPick, setRandomPick] = useState(null);
    const [victoryModal, setVictoryModal] = useState(null);

    const open = customList.filter((e) => !e.done);
    const done = customList.filter((e) => e.done);

    const completeWithVictory = (id, victory) => {
        setCustomList((l) => l.map((e) => e.id === id ? { ...e, done: true, victory } : e));
        setVictoryModal(null);
    };

    const uncomplete = (id) => setCustomList((l) => l.map((e) => e.id === id ? { ...e, done: false, victory: null } : e));
    const remove = (id) => setCustomList((l) => l.filter((e) => e.id !== id));
    const openNote = (entry) => { setNoteTarget(entry.id); setNoteText(entry.notes || ""); };
    const saveNote = () => { setCustomList((l) => l.map((e) => e.id === noteTarget ? { ...e, notes: noteText } : e)); setNoteTarget(null); };
    const moveUp = (idx) => { if (idx === 0) return; setCustomList((l) => { const a = [...l];[a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a; }); };
    const moveDown = (idx) => { if (idx >= customList.length - 1) return; setCustomList((l) => { const a = [...l];[a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a; }); };
    const pickRandom = () => {
        if (!open.length) return;
        setRandomPick(null);
        setTimeout(() => setRandomPick(open[Math.floor(Math.random() * open.length)]), 0);
    };

    const Card = ({ entry }) => {
        const idx = customList.indexOf(entry);
        const vc = entry.victory ? VICTORY_COLORS[entry.victory] : null;
        return (
            <div style={{
                borderRadius: 10, overflow: "hidden",
                border: `1px solid ${entry.done ? "rgba(74,222,128,0.22)" : t.border}`,
                background: entry.done ? (t.bg3) : t.bg3,
                opacity: entry.done ? 0.7 : 1,
                transition: "all 0.2s",
                marginBottom: 10,
            }}>
                <div style={{ height: 2, background: entry.done ? (vc ?? "#4ade80") : entry.raceColor }} />
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>

                    <div onClick={() => { if (entry.done) { uncomplete(entry.id); } else { setVictoryModal(entry); } }}
                        style={{ width: 22, height: 22, borderRadius: 4, flexShrink: 0, border: `1px solid ${entry.done ? "#4ade80" : t.inputBorder}`, background: entry.done ? "rgba(74,222,128,0.18)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#4ade80", cursor: "pointer", transition: "all 0.2s" }}>
                        {entry.done && "✓"}
                    </div>

                    {entry.raceIcon && entry.raceIcon.startsWith("http")
                        ? <img src={entry.raceIcon} alt="" style={{ width: 32, height: 32, objectFit: "contain", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))", flexShrink: 0 }} onError={(e) => { e.target.style.display = "none"; }} />
                        : <span style={{ fontSize: 22, flexShrink: 0 }}>{entry.raceIcon}</span>
                    }

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 2 }}>
                            <span style={{ fontSize: 15, color: entry.done ? t.text5 : t.text1, textDecoration: entry.done ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.lordName}</span>
                            {entry.done && entry.victory && (
                                <span style={{ fontSize: 9, padding: "1px 7px", borderRadius: 10, background: `${VICTORY_COLORS[entry.victory]}18`, color: VICTORY_COLORS[entry.victory], border: `1px solid ${VICTORY_COLORS[entry.victory]}40`, letterSpacing: 1, flexShrink: 0 }}>🏆 {entry.victory}</span>
                            )}
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span style={{ fontSize: 11, color: entry.raceColor, fontWeight: "normal" }}>{entry.raceName}</span>
                            <span style={{ fontSize: 10, color: t.text4 }}>·</span>
                            <span style={{ fontSize: 10, color: t.text4 }}>{entry.dlc}</span>
                        </div>
                        {entry.notes && (
                            <div style={{ marginTop: 6, fontSize: 11, color: t.text3, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 5, padding: "4px 8px", display: "inline-block", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📝 {entry.notes}</div>
                        )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                        <div style={{ display: "flex", gap: 4 }}>
                            <button onClick={() => moveUp(idx)} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 4, cursor: "pointer", background: "transparent", border: `1px solid ${t.border}`, color: t.text4, fontFamily: "inherit" }}>↑</button>
                            <button onClick={() => moveDown(idx)} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 4, cursor: "pointer", background: "transparent", border: `1px solid ${t.border}`, color: t.text4, fontFamily: "inherit" }}>↓</button>
                            <button onClick={() => openNote(entry)} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 4, cursor: "pointer", background: entry.notes ? t.accentGlow : "transparent", border: `1px solid ${entry.notes ? t.accent + "60" : t.border}`, color: entry.notes ? t.accent : t.text4, fontFamily: "inherit" }}>📝</button>
                            <button onClick={() => remove(entry.id)} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 4, cursor: "pointer", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontFamily: "inherit" }}>✕</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

            {victoryModal && (
                <div onClick={() => setVictoryModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 14, padding: "30px 36px", minWidth: 340, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", textAlign: "center" }}>
                        <div style={{ fontSize: 28, marginBottom: 10 }}>🏆</div>
                        <div style={{ fontSize: 10, letterSpacing: 4, color: t.text4, textTransform: "uppercase", marginBottom: 6 }}>Campaign Complete</div>
                        <div style={{ fontSize: 18, color: t.text1, marginBottom: 2 }}>{victoryModal.lordName}</div>
                        <div style={{ fontSize: 12, color: victoryModal.raceColor, marginBottom: 18 }}>{victoryModal.raceName}</div>
                        <div style={{ fontSize: 13, color: t.text4, marginBottom: 22 }}>Which victory did you achieve?</div>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            {VICTORIES.map(v => (
                                <button key={v} onClick={() => completeWithVictory(victoryModal.id, v)} style={{ fontSize: 13, padding: "10px 20px", borderRadius: 8, cursor: "pointer", background: `${VICTORY_COLORS[v]}18`, border: `1px solid ${VICTORY_COLORS[v]}60`, color: VICTORY_COLORS[v], fontFamily: "inherit", transition: "all 0.15s" }}>{v}</button>
                            ))}
                        </div>
                        <button onClick={() => setVictoryModal(null)} style={{ marginTop: 16, fontSize: 12, color: t.text4, background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    </div>
                </div>
            )}

            <div style={{ padding: "13px 34px", borderBottom: `1px solid ${t.border}`, background: t.topbar, display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
                <div>
                    <div style={{ fontSize: 9, letterSpacing: 4, color: t.text4, textTransform: "uppercase", marginBottom: 2 }}>Campaign Queue</div>
                    <div style={{ fontSize: 18, color: t.text1, fontWeight: "normal", lineHeight: 1 }}>My List</div>
                </div>
                <div style={{ display: "flex", gap: 10, marginLeft: "auto", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: t.text4 }}>{open.length} pending · {done.length} done</span>
                    <button onClick={pickRandom} disabled={!open.length} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 6, cursor: open.length ? "pointer" : "default", background: "transparent", border: `1px solid ${open.length ? t.accent + "60" : t.border}`, color: open.length ? t.accent : t.text4, fontFamily: "inherit" }}>🎲 Surprise me!</button>
                    <button onClick={() => setCustomList((l) => l.filter((e) => !e.done))} disabled={!done.length} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 6, cursor: done.length ? "pointer" : "default", background: "transparent", border: `1px solid ${done.length ? "rgba(239,68,68,0.3)" : t.border}`, color: done.length ? "#ef4444" : t.text4, fontFamily: "inherit" }}>Remove completed</button>
                </div>
            </div>

            {randomPick && (
                <div style={{ padding: "12px 34px", background: `${randomPick.raceColor}12`, borderBottom: `1px solid ${randomPick.raceColor}30`, display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                    {randomPick.raceIcon && randomPick.raceIcon.startsWith("http")
                        ? <img src={randomPick.raceIcon} alt="" style={{ width: 28, height: 28, objectFit: "contain", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} onError={(e) => { e.target.style.display = "none"; }} />
                        : <span style={{ fontSize: 20 }}>{randomPick.raceIcon}</span>
                    }
                    <div>
                        <span style={{ fontSize: 10, color: randomPick.raceColor, letterSpacing: 2, textTransform: "uppercase" }}>🎲 Randomly picked · </span>
                        <span style={{ fontSize: 14, color: t.text1 }}>{randomPick.lordName}</span>
                        <span style={{ fontSize: 12, color: t.text3 }}> — {randomPick.raceName}</span>
                    </div>
                    <button onClick={() => setRandomPick(null)} style={{ marginLeft: "auto", fontSize: 11, padding: "4px 10px", borderRadius: 5, cursor: "pointer", background: "transparent", border: `1px solid ${t.border}`, color: t.text4, fontFamily: "inherit" }}>✕</button>
                </div>
            )}

            <div style={{ flex: 1, overflowY: "auto", padding: "22px 34px" }}>
                {customList.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 0" }}>
                        <div style={{ fontSize: 44, marginBottom: 16 }}>🗒</div>
                        <div style={{ fontSize: 16, color: t.text2, marginBottom: 8 }}>Your list is empty</div>
                        <div style={{ fontSize: 13, color: t.text4 }}>Go to the <strong>Faction Browser</strong> and add lords.</div>
                    </div>
                ) : (
                    <>
                        {open.length > 0 && (
                            <>
                                <div style={{ fontSize: 9, letterSpacing: 3, color: t.text4, textTransform: "uppercase", marginBottom: 12 }}>Pending — {open.length}</div>
                                {open.map((e) => <Card key={e.id} entry={e} />)}
                            </>
                        )}
                        {done.length > 0 && (
                            <>
                                <div style={{ fontSize: 9, letterSpacing: 3, color: t.text4, textTransform: "uppercase", margin: "22px 0 12px" }}>Completed — {done.length}</div>
                                {done.map((e) => <Card key={e.id} entry={e} />)}
                            </>
                        )}
                    </>
                )}
            </div>

            {noteTarget && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={saveNote}>
                    <div onClick={(e) => e.stopPropagation()} style={{ background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 12, padding: "26px 30px", width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                        <div style={{ fontSize: 14, color: t.text1, marginBottom: 3 }}>Note</div>
                        <div style={{ fontSize: 11, color: t.text4, marginBottom: 12 }}>{customList.find((e) => e.id === noteTarget)?.lordName} — {customList.find((e) => e.id === noteTarget)?.raceName}</div>
                        <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Your notes for this campaign..." autoFocus style={{ width: "100%", height: 110, background: t.input, border: `1px solid ${t.border}`, borderRadius: 8, padding: "9px 12px", color: t.text2, fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                        <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
                            <button onClick={() => setNoteTarget(null)} style={{ fontSize: 12, padding: "7px 16px", borderRadius: 7, cursor: "pointer", background: "transparent", border: `1px solid ${t.border}`, color: t.text3, fontFamily: "inherit" }}>Cancel</button>
                            <button onClick={saveNote} style={{ fontSize: 12, padding: "7px 18px", borderRadius: 7, cursor: "pointer", background: t.accentGlow, border: `1px solid ${t.accent}60`, color: t.accent, fontFamily: "inherit" }}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}