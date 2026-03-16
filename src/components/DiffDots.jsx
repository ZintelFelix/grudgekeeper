export default function DiffDots({ value, color }) {
    return (
        <div style={{ display: "flex", gap: 3 }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i <= value ? color : "rgba(120,90,50,0.3)" }} />
            ))}
        </div>
    );
}