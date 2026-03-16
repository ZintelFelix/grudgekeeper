const COLORS = {
    "Low": "#4ade80",
    "Medium": "#facc15",
    "High": "#f97316",
    "Very High": "#ef4444",
};

export default function PressureBadge({ level }) {
    const color = COLORS[level] ?? "#aaa";
    return (
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: `${color}18`, border: `1px solid ${color}40`, color }}>
            {level}
        </span>
    );
}