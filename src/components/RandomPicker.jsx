import { useState, useEffect } from "react";
import Tag from "./Tag";

export default function RandomPicker({ entries, onConfirm, onClose }) {
    const [result, setResult] = useState(null);
    const [rolling, setRolling] = useState(true);
    const [display, setDisplay] = useState(entries[0] ?? null);

    useEffect(() => {
        if (!entries.length) { setRolling(false); return; }

        let count = 0;
        const iv = setInterval(() => {
            setDisplay(entries[Math.floor(Math.random() * entries.length)]);
            count++;
            if (count > 20) {
                clearInterval(iv);
                const pick = entries[Math.floor(Math.random() * entries.length)];
                setResult(pick);
                setDisplay(pick);
                setRolling(false);
            }
        }, 75);

        return () => clearInterval(iv);
    }, []);

    const shown = display ?? entries[0];
    const col = shown?.tierColor ?? "#f97316";

    return (
        <div
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{ background: "#0e0a06", border: `1px solid ${col}40`, borderRadius: 16, padding: "44px 52px", textAlign: "center", minWidth: 380, boxShadow: `0 0 60px ${col}20` }}
            >
                <div style={{ fontSize: 36, marginBottom: 16 }}>🎲</div>

                <div style={{ fontSize: 11, letterSpacing: 4, color: "#7a6040", textTransform: "uppercase", marginBottom: 10 }}>
                    {rolling ? "Rolling..." : "Your next campaign"}
                </div>

                <div style={{ fontSize: 30, color: rolling ? "#8a7050" : col, marginBottom: 6, minHeight: 44, transition: "color 0.1s", fontWeight: "normal" }}>
                    {shown?.faction ?? "–"}
                </div>

                <div style={{ fontSize: 15, color: "#9a8060", marginBottom: 20 }}>
                    {shown?.lord}
                </div>

                {!rolling && result && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                        {(result.tags ?? []).map((tag) => (
                            <Tag key={tag} label={tag} color={col} />
                        ))}
                    </div>
                )}

                <button
                    onClick={() => {
                        if (!rolling && result) {
                            onConfirm(result);
                        } else {
                            onClose();
                        }
                    }}
                    style={{ background: rolling ? "transparent" : `${col}20`, border: `1px solid ${rolling ? "rgba(255,255,255,0.1)" : col + "60"}`, color: rolling ? "#7a6040" : col, padding: "10px 30px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
                >
                    {rolling ? "Cancel" : "Let's go! ⚔️"}
                </button>
            </div>
        </div>
    );
}