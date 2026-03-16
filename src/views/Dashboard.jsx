import { useTheme } from "../context/ThemeContext";
import DiffDots from "../components/DiffDots";
import Tag from "../components/Tag";

const isDone = (val) => val?.done ?? !!val;

export default function Dashboard({ roadmap, checked, activeCampaign, setActiveCampaign }) {
    const t = useTheme();

    const allEntries = roadmap.flatMap((tier) =>
        tier.entries.map((e) => ({ ...e, tierColor: tier.tierColor, tierLabel: tier.tierLabel }))
    );
    const getKey = (entry) => {
        const tier = roadmap.find((r) => r.tier === entry.tier);
        return `${entry.tier}-${tier.entries.findIndex((x) => x.id === entry.id)}`;
    };

    const done = Object.values(checked).filter(isDone).length;
    const total = allEntries.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    const suggested = allEntries.find((e) => {
        const key = getKey(e);
        if (isDone(checked[key])) return false;
        const tierIdx = roadmap.findIndex((r) => r.tier === e.tier);
        if (tierIdx === 0) return true;
        const prev = roadmap[tierIdx - 1];
        return prev.entries.every((_, i) => isDone(checked[`${prev.tier}-${i}`]));
    }) || allEntries.find((e) => !isDone(checked[getKey(e)]));

    const currentCamp = allEntries.find((e) => e.id === activeCampaign);

    return (
        <div style={{ padding: "34px 42px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            <div style={{ fontSize: 10, letterSpacing: 5, color: t.text4, textTransform: "uppercase", marginBottom: 6 }}>Overview</div>
            <h2 style={{ fontSize: 26, color: t.text1, fontWeight: "normal", margin: "0 0 26px" }}>Dashboard</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
                {[
                    { label: "Completed", value: done, sub: `of ${total} campaigns`, color: "#4ade80" },
                    { label: "Progress", value: `${pct}%`, sub: "of the full Roadmap", color: "#facc15" },
                    {
                        label: "Current Tier",
                        value: roadmap.find((r) => r.entries.some((_, i) => !isDone(checked[`${r.tier}-${i}`])))?.tier ?? "✓",
                        sub: roadmap.find((r) => r.entries.some((_, i) => !isDone(checked[`${r.tier}-${i}`])))?.tierLabel ?? "All done!",
                        color: "#f97316",
                    },
                    { label: "Remaining", value: total - done, sub: "campaigns left", color: "#c084fc" },
                ].map((s) => (
                    <div key={s.label} style={{ background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 10, padding: "16px 18px" }}>
                        <div style={{ fontSize: 10, color: t.text4, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                        <div style={{ fontSize: 28, color: s.color, fontWeight: "normal", lineHeight: 1, marginBottom: 3 }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: t.text3 }}>{s.sub}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
                <div style={{ background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 10, padding: "18px 20px" }}>
                    <div style={{ fontSize: 10, color: t.text4, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Tier Progress</div>
                    {roadmap.map((r) => {
                        const d = r.entries.filter((_, i) => isDone(checked[`${r.tier}-${i}`])).length;
                        return (
                            <div key={r.tier} style={{ marginBottom: 11 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                                    <span style={{ color: t.text2 }}>{r.tierLabel}</span>
                                    <span style={{ color: r.tierColor }}>{d}/{r.entries.length}</span>
                                </div>
                                <div style={{ background: t.bg2, borderRadius: 3, height: 4, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${(d / r.entries.length) * 100}%`, background: r.tierColor, transition: "width 0.5s", borderRadius: 3 }} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 10, padding: "18px 20px", flex: 1 }}>
                        <div style={{ fontSize: 10, color: t.text4, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>▶ Active Campaign</div>
                        {currentCamp ? (
                            <div>
                                <div style={{ fontSize: 16, color: t.text1, marginBottom: 3 }}>{currentCamp.faction}</div>
                                <div style={{ fontSize: 12, color: currentCamp.tierColor, marginBottom: 8 }}>{currentCamp.lord}</div>
                                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                                    {currentCamp.tags.map((tag) => <Tag key={tag} label={tag} color={currentCamp.tierColor} />)}
                                </div>
                                <button onClick={() => setActiveCampaign(null)} style={{ fontSize: 11, color: t.text3, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 5, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>End</button>
                            </div>
                        ) : (
                            <div style={{ fontSize: 13, color: t.text4, fontStyle: "italic", lineHeight: 1.6 }}>
                                No active campaign.<br /><span style={{ fontSize: 11 }}>Start one in the Roadmap.</span>
                            </div>
                        )}
                    </div>

                    {suggested && (
                        <div style={{ background: t.bg3, border: `1px solid rgba(160,80,200,0.15)`, borderRadius: 10, padding: "18px 20px", flex: 1 }}>
                            <div style={{ fontSize: 10, color: "#c060d8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>✦ Suggested</div>
                            <div style={{ fontSize: 15, color: t.text1, marginBottom: 2 }}>{suggested.faction}</div>
                            <div style={{ fontSize: 12, color: suggested.tierColor, marginBottom: 8 }}>{suggested.lord}</div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <DiffDots value={suggested.difficulty} color={suggested.tierColor} />
                                <span style={{ fontSize: 11, color: t.text3 }}>Difficulty</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {done > 0 && (
                <div style={{ background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 10, padding: "18px 20px" }}>
                    <div style={{ fontSize: 10, color: t.text4, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Hall of Fame – Completed Campaigns</div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {allEntries.filter((e) => isDone(checked[getKey(e)])).map((e) => (
                            <div key={e.id} style={{ background: t.bg2, border: `1px solid ${e.tierColor}30`, borderRadius: 8, padding: "10px 14px", minWidth: 140 }}>
                                <div style={{ fontSize: 13, color: t.text1, marginBottom: 1 }}>{e.faction}</div>
                                <div style={{ fontSize: 11, color: e.tierColor }}>{e.lord}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}