import { useTheme } from "../context/ThemeContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

const VICTORY_COLORS = { Short: "#facc15", Long: "#4ade80", Ultimate: "#c084fc" };

const isDone = (val) => val?.done ?? !!val;
const getVictory = (val) => val?.victory ?? null;

export default function Statistics({ roadmap, checked, customList }) {
    const t = useTheme();

    const allEntries = roadmap.flatMap(tier =>
        tier.entries.map((e, i) => ({
            ...e,
            tierColor: tier.tierColor,
            tierLabel: tier.tierLabel,
            isDone: isDone(checked[`${tier.tier}-${i}`]),
            victory: getVictory(checked[`${tier.tier}-${i}`]),
        }))
    );

    const doneEntries = allEntries.filter(e => e.isDone);

    const total = allEntries.length;
    const done = doneEntries.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    const avgDifficulty = doneEntries.length > 0
        ? (doneEntries.reduce((sum, e) => sum + e.difficulty, 0) / doneEntries.length).toFixed(1)
        : "—";

    const tagCounts = doneEntries.flatMap(e => e.tags).reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {});
    const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    const tierData = roadmap.map(tier => ({
        name: tier.tierLabel,
        done: tier.entries.filter((_, i) => isDone(checked[`${tier.tier}-${i}`])).length,
        total: tier.entries.length,
        color: tier.tierColor,
    }));

    const styleData = Object.entries(
        doneEntries.reduce((acc, e) => {
            (e.styles ?? []).forEach(s => {
                acc[s.label] = (acc[s.label] || 0) + 1;
            });
            return acc;
        }, {})
    ).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));

    const gameData = ["WH1", "WH2", "WH3"].map(game => ({
        name: game,
        done: doneEntries.filter(e => e.game === game).length,
        total: allEntries.filter(e => e.game === game).length,
    }));

    const dlcData = [
        { name: "Base", done: doneEntries.filter(e => e.dlc.includes("Base")).length, total: allEntries.filter(e => e.dlc.includes("Base")).length },
        { name: "DLC", done: doneEntries.filter(e => !e.dlc.includes("Base")).length, total: allEntries.filter(e => !e.dlc.includes("Base")).length },
    ];

    const victoryData = ["Short", "Long", "Ultimate"].map(v => ({
        name: v,
        value: doneEntries.filter(e => e.victory === v).length,
        color: VICTORY_COLORS[v],
    })).filter(v => v.value > 0);

    return (
        <div style={{ padding: "34px 42px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            <div style={{ fontSize: 10, letterSpacing: 5, color: t.text4, textTransform: "uppercase", marginBottom: 6 }}>Analytics</div>
            <h2 style={{ fontSize: 26, color: t.text1, fontWeight: "normal", margin: "0 0 26px" }}>Statistics</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
                {[
                    { label: "Completed", value: done, sub: `of ${total} campaigns`, color: "#4ade80" },
                    { label: "Completion", value: `${pct}%`, sub: "of full roadmap", color: "#facc15" },
                    { label: "Avg. Difficulty", value: avgDifficulty, sub: "completed campaigns", color: "#f97316" },
                    { label: "Favourite Tag", value: topTag, sub: "most played style", color: t.accent },
                ].map(s => (
                    <div key={s.label} style={{ background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 10, padding: "16px 18px" }}>
                        <div style={{ fontSize: 10, color: t.text4, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                        <div style={{ fontSize: 28, color: s.color, fontWeight: "normal", lineHeight: 1, marginBottom: 3 }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: t.text3 }}>{s.sub}</div>
                    </div>
                ))}
            </div>

            <div style={{ background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 10, padding: "18px 20px", marginBottom: 18 }}>
                <div style={{ fontSize: 10, color: t.text4, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Progress by Tier</div>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={tierData} barSize={32}>
                        <XAxis dataKey="name" stroke={t.text4} tick={{ fontSize: 11, fill: t.text4 }} />
                        <YAxis stroke={t.text4} tick={{ fontSize: 11, fill: t.text4 }} allowDecimals={false} />
                        <Tooltip contentStyle={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text1, fontSize: 12 }} formatter={(value, name) => [value, name === "done" ? "Completed" : "Total"]} />
                        <Bar dataKey="total" fill={t.border} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="done" radius={[4, 4, 0, 0]}>
                            {tierData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

                <div style={{ background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 10, padding: "18px 20px" }}>
                    <div style={{ fontSize: 10, color: t.text4, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Playstyle Distribution</div>
                    {styleData.length === 0 ? (
                        <div style={{ fontSize: 13, color: t.text4, fontStyle: "italic" }}>No completed campaigns yet.</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={styleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={30} label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`} labelLine={true} fontSize={18}>
                                    {styleData.map((_, i) => (
                                        <Cell key={i} fill={["#c8920a", "#4ade80", "#f97316", "#c084fc", "#facc15", "#38bdf8", "#e879f9"][i % 7]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text1, fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div style={{ background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 10, padding: "18px 20px" }}>
                    <div style={{ fontSize: 10, color: t.text4, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Victory Types</div>
                    {victoryData.length === 0 ? (
                        <div style={{ fontSize: 13, color: t.text4, fontStyle: "italic" }}>No completed campaigns yet.</div>
                    ) : (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <BarChart data={victoryData} barSize={40}>
                                    <XAxis dataKey="name" stroke={t.text4} tick={{ fontSize: 11, fill: t.text4 }} />
                                    <YAxis stroke={t.text4} tick={{ fontSize: 11, fill: t.text4 }} allowDecimals={false} />
                                    <Tooltip contentStyle={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text1, fontSize: 12 }} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {victoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                                {victoryData.map(v => (
                                    <div key={v.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: 2, background: v.color }} />
                                        <span style={{ fontSize: 18, color: t.text3 }}>{v.name}: {v.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div style={{ background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 10, padding: "18px 20px" }}>
                    <div style={{ fontSize: 10, color: t.text4, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Progress by Game</div>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={gameData} barSize={28}>
                            <XAxis dataKey="name" stroke={t.text4} tick={{ fontSize: 11, fill: t.text4 }} />
                            <YAxis stroke={t.text4} tick={{ fontSize: 11, fill: t.text4 }} allowDecimals={false} />
                            <Tooltip contentStyle={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text1, fontSize: 12 }} />
                            <Bar dataKey="total" fill={t.border} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="done" fill={t.accent} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 10, padding: "18px 20px", gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: 10, color: t.text4, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Base vs. DLC</div>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={dlcData} barSize={40}>
                            <XAxis dataKey="name" stroke={t.text4} tick={{ fontSize: 11, fill: t.text4 }} />
                            <YAxis stroke={t.text4} tick={{ fontSize: 11, fill: t.text4 }} allowDecimals={false} />
                            <Tooltip contentStyle={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text1, fontSize: 12 }} />
                            <Bar dataKey="total" fill={t.border} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="done" fill="#c084fc" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
}