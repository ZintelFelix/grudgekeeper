export default function Tag({ label, color }) {
    return (
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: `${color}18`, border: `1px solid ${color}35`, color: `${color}dd`, letterSpacing: 0.3 }}>
            {label}
        </span>
    );
}