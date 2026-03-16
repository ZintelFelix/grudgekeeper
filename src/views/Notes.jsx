import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Notes({ notes, setNotes }) {
    const t = useTheme();
    const [activeId, setActiveId] = useState(notes[0]?.id || null);
    const current = notes.find((n) => n.id === activeId);

    const addNote = () => {
        const id = `note_${Date.now()}`;
        const neu = { id, title: "New Note", content: "", created: Date.now() };
        setNotes((prev) => [neu, ...prev]);
        setActiveId(id);
    };

    const deleteNote = (id) => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        if (activeId === id) setActiveId(notes.find((n) => n.id !== id)?.id || null);
    };

    const updateNote = (id, field, value) =>
        setNotes((prev) => prev.map((n) => n.id === id ? { ...n, [field]: value } : n));

    return (
        <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "26px 34px", overflow: "hidden" }}>
                <div style={{ fontSize: 9, letterSpacing: 5, color: t.text4, textTransform: "uppercase", marginBottom: 5 }}>Notebook</div>
                <div style={{ fontSize: 22, color: t.text1, fontWeight: "normal", marginBottom: 16 }}>Notes & Thoughts</div>

                {current ? (
                    <>
                        <input
                            value={current.title}
                            onChange={(e) => updateNote(current.id, "title", e.target.value)}
                            style={{ fontSize: 17, color: t.text1, background: "transparent", border: "none", outline: "none", fontFamily: "inherit", marginBottom: 6, borderBottom: `1px solid ${t.border}`, paddingBottom: 8 }}
                            placeholder="Title..."
                        />
                        <textarea
                            value={current.content}
                            onChange={(e) => updateNote(current.id, "content", e.target.value)}
                            placeholder={"Write down anything you notice while playing...\n\n• Strategies that worked well\n• Factions you still want to try\n• General insights and tips"}
                            style={{ flex: 1, background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 10, padding: "16px 18px", fontSize: 14, color: t.text2, fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.8 }}
                        />
                    </>
                ) : (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                        <div style={{ fontSize: 36 }}>✎</div>
                        <div style={{ fontSize: 15, color: t.text3 }}>Select a note or create a new one</div>
                        <button onClick={addNote} style={{ fontSize: 13, padding: "9px 22px", borderRadius: 8, cursor: "pointer", background: t.accentGlow, border: `1px solid ${t.accent}60`, color: t.accent, fontFamily: "inherit" }}>+ New Note</button>
                    </div>
                )}
            </div>

            <div style={{ width: 290, flexShrink: 0, borderLeft: `1px solid ${t.border}`, display: "flex", flexDirection: "column", background: t.sidebar }}>
                <div style={{ padding: "26px 18px 14px", borderBottom: `1px solid ${t.border}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ fontSize: 9, letterSpacing: 3, color: t.text4, textTransform: "uppercase", marginBottom: 3 }}>My Notes</div>
                        <div style={{ fontSize: 15, color: t.text1 }}>{notes.length} Note{notes.length !== 1 ? "s" : ""}</div>
                    </div>
                    <button onClick={addNote} style={{ fontSize: 22, lineHeight: 1, color: t.accent, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>+</button>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
                    {notes.length === 0 && (
                        <div style={{ fontSize: 13, color: t.text4, fontStyle: "italic", lineHeight: 1.7 }}>No notes yet. Click + to create one.</div>
                    )}
                    {notes.map((n) => (
                        <div key={n.id} onClick={() => setActiveId(n.id)} style={{ padding: "10px", borderRadius: 7, background: activeId === n.id ? t.accentGlow : t.bg3, border: `1px solid ${activeId === n.id ? t.accent + "40" : t.border}`, cursor: "pointer", marginBottom: 5, display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, color: t.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title || "Untitled"}</div>
                                <div style={{ fontSize: 10, color: t.text4 }}>{new Date(n.created).toLocaleDateString("en-GB")}</div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); deleteNote(n.id); }} style={{ fontSize: 12, color: "#ef4444", background: "transparent", border: "none", cursor: "pointer", opacity: 0.5, flexShrink: 0 }}>✕</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}