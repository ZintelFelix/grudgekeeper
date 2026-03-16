import { useState } from "react";
import { ThemeCtx, DARK, LIGHT } from "./context/ThemeContext";
import usePersist from "./hooks/usePersist";
import useCSV, {
  buildRoadmap,
  buildRaces
} from "./hooks/useCSV";

import Dashboard from "./views/Dashboard";
import RoadmapView from "./views/RoadmapView";
import AllFactions from "./views/AllFactions";
import FactionBrowser from "./views/FactionBrowser";
import MyList from "./views/MyList";
import Notes from "./views/Notes";
import RandomPicker from "./components/RandomPicker";
import Statistics from "./views/Statistic";

export default function App() {

  const [isDark, setIsDark] = usePersist("tww3_dark", true);
  const [view, setView] = usePersist("tww3_view", "dashboard");
  const [checked, setChecked] = usePersist("tww3_checked", {});
  const [activeTier, setActiveTier] = usePersist("tww3_activeTier", 1);
  const [activeCampaign, setActiveCampaign] = usePersist("tww3_activeCampaign", null);
  const [customList, setCustomList] = usePersist("tww3_customList", []);
  const [globalNotes, setGlobalNotes] = usePersist("tww3_notes", []);
  const [showPicker, setShowPicker] = useState(false);

  const { data: roadmapCsv, loading: loadingRoadmap } = useCSV("/data/roadmap.csv");
  const { data: racesCsv, loading: loadingRaces } = useCSV("/data/races.csv");

  const roadmap = loadingRoadmap ? [] : buildRoadmap(roadmapCsv);
  const races = loadingRaces ? [] : buildRaces(racesCsv);

  const theme = isDark ? DARK : LIGHT;

  const allEntries = roadmap.flatMap((t) => t.entries);
  const activeFaction = allEntries.find((e) => e.id === activeCampaign);
  const done = Object.values(checked).filter(v => v?.done ?? !!v).length;
  const total = allEntries.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const nav = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "roadmap", icon: "⬡", label: "Roadmap" },
    { id: "allfactions", icon: "≡", label: "All Factions" },
    { id: "browser", icon: "⚔", label: "Faction Browser" },
    { id: "mylist", icon: "🗒", label: "My List", badge: customList.filter((e) => !e.done).length },
    { id: "notes", icon: "✎", label: "Notes", badge: globalNotes.length || null },
    { id: "statistics", icon: "🗠", label: "Statistics" }
  ];

  if (loadingRoadmap || loadingRaces) {
    return (
      <div style={{ height: "100vh", width: "100vw", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Palatino, serif", color: theme.text3, fontSize: 16 }}>
        Loading data...
      </div>
    );
  }

  const bgGradient = isDark
    ? "radial-gradient(ellipse 60% 55% at 18% 45%, rgba(90,28,8,0.18) 0%, transparent 55%), radial-gradient(ellipse 40% 45% at 82% 28%, rgba(55,18,80,0.12) 0%, transparent 50%), radial-gradient(ellipse 30% 35% at 60% 85%, rgba(70,35,5,0.10) 0%, transparent 50%)"
    : "radial-gradient(ellipse 60% 55% at 18% 40%, rgba(180,130,20,0.12) 0%, transparent 55%), radial-gradient(ellipse 40% 40% at 80% 70%, rgba(120,80,10,0.08) 0%, transparent 50%)";

  return (
    <ThemeCtx.Provider value={theme}>
      <div style={{ height: "100vh", width: "100vw", display: "flex", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", color: theme.text1, overflow: "hidden", background: theme.bg, backgroundImage: bgGradient }}>

        <div style={{ width: 265, flexShrink: 0, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", background: theme.sidebar, backdropFilter: "blur(12px)", zIndex: 1 }}>

          <div style={{ padding: "24px 20px 18px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 8, letterSpacing: 4, color: theme.text4, textTransform: "uppercase", marginBottom: 6 }}>Total War: Warhammer III</div>
              <div style={{ fontSize: 22, letterSpacing: 3, color: theme.accent, textTransform: "uppercase", fontWeight: "bold", lineHeight: 1 }}>Grudgekeeper</div>
              <div style={{ marginTop: 7, borderTop: `1px solid ${theme.border}`, paddingTop: 6, fontSize: 9, letterSpacing: 3, color: theme.text4, textTransform: "uppercase" }}>Campaign Chronicles</div>
            </div>
          </div>

          <div style={{ padding: "12px 20px 14px", borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: theme.text4, marginBottom: 5 }}>
              <span>Total</span>
              <span style={{ color: theme.text3 }}>{done}/{total}</span>
            </div>
            <div style={{ background: isDark ? "#0f0904" : "#e0d8cc", borderRadius: 3, height: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${isDark ? "#6a2e08" : "#8a4010"}, ${isDark ? "#b05c14" : "#c07030"}, ${isDark ? "#d8b030" : "#d4a030"})`, transition: "width 0.5s", borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 9, color: theme.text5, marginTop: 4 }}>{pct}% complete</div>
          </div>

          <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
            {nav.map((item) => (
              <button key={item.id} onClick={() => setView(item.id)} style={{ width: "100%", background: view === item.id ? theme.accentGlow : "transparent", border: "none", borderLeft: view === item.id ? `3px solid ${theme.accent}` : "3px solid transparent", cursor: "pointer", padding: "11px 20px", display: "flex", alignItems: "center", gap: 10, textAlign: "left", transition: "all 0.15s" }}>
                <span style={{ fontSize: 15, color: view === item.id ? theme.accent : theme.text4 }}>{item.icon}</span>
                <span style={{ fontSize: 12, color: view === item.id ? theme.accent : theme.text3, flex: 1 }}>{item.label}</span>
                {item.badge > 0 && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 10, background: theme.bg3, color: theme.text3, border: `1px solid ${theme.border}` }}>{item.badge}</span>}
              </button>
            ))}
          </nav>

          {view === "roadmap" && (
            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 8, paddingBottom: 8 }}>
              {roadmap.map((r) => {
                const d = r.entries.filter((_, i) => { const v = checked[`${r.tier}-${i}`]; return v?.done ?? !!v; }).length;
                const isAct = activeTier === r.tier;
                return (
                  <button key={r.tier} onClick={() => setActiveTier(r.tier)} style={{ width: "100%", background: isAct ? r.tierBg : "transparent", border: "none", borderLeft: isAct ? `3px solid ${r.tierColor}` : "3px solid transparent", cursor: "pointer", padding: "8px 20px", display: "flex", gap: 8, alignItems: "center", textAlign: "left" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: isAct ? r.tierBg : "transparent", border: `1px solid ${isAct ? r.tierColor + "60" : theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: isAct ? r.tierColor : theme.text4, flexShrink: 0 }}>{r.tier}</div>
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: 1, color: isAct ? r.tierColor : theme.text3, textTransform: "uppercase" }}>{r.tierLabel}</div>
                      <div style={{ fontSize: 9, color: theme.text5 }}>{d}/{r.entries.length}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {activeFaction && (
            <div style={{ padding: "10px 18px", borderTop: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "#5a9a40", textTransform: "uppercase", marginBottom: 4 }}>▶ Active</div>
              <div style={{ fontSize: 12, color: "#a0d070" }}>{activeFaction.faction}</div>
              <div style={{ fontSize: 10, color: "#5a7030" }}>{activeFaction.lord}</div>
            </div>
          )}

          <div style={{ padding: "12px 14px", borderTop: `1px solid ${theme.border}`, display: "flex", gap: 8, alignItems: "center" }}>

            <button
              onClick={() => setShowPicker(true)}
              title="Pick a random faction"
              style={{ flex: 1, fontSize: 11, padding: "7px 8px", borderRadius: 7, cursor: "pointer", background: theme.accentGlow, border: `1px solid ${theme.accent}50`, color: theme.accent, fontFamily: "inherit", textAlign: "center" }}
            >
              🎲 Random
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              title={isDark ? "Light Mode" : "Dark Mode"}
              style={{ padding: "7px 10px", borderRadius: 7, cursor: "pointer", background: "transparent", border: `1px solid ${theme.border}`, fontSize: 14, color: theme.text3, lineHeight: 1, flexShrink: 0 }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>


        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", zIndex: 1 }}>

          {showPicker && (
            <RandomPicker
              entries={allEntries.filter((e) => {
                const tier = roadmap.find((r) => r.tier === e.tier);
                const idx = tier?.entries.findIndex((x) => x.id === e.id) ?? -1;
                return idx !== -1 && !checked[`${e.tier}-${idx}`];
              })}
              onConfirm={(entry) => { setActiveCampaign(entry.id); setShowPicker(false); setView("roadmap"); }}
              onClose={() => setShowPicker(false)}
            />
          )}
          {view === "dashboard" && <Dashboard roadmap={roadmap} checked={checked} activeCampaign={activeCampaign} setActiveCampaign={setActiveCampaign} />}
          {view === "roadmap" && <RoadmapView roadmap={roadmap} checked={checked} setChecked={setChecked} activeCampaign={activeCampaign} setActiveCampaign={setActiveCampaign} activeTier={activeTier} setActiveTier={setActiveTier} />}
          {view === "allfactions" && <AllFactions roadmap={roadmap} checked={checked} setChecked={setChecked} activeCampaign={activeCampaign} setActiveCampaign={setActiveCampaign} />}
          {view === "browser" && <FactionBrowser races={races} customList={customList} setCustomList={setCustomList} />}
          {view === "mylist" && <MyList customList={customList} setCustomList={setCustomList} />}
          {view === "notes" && <Notes notes={globalNotes} setNotes={setGlobalNotes} />}
          {view === "statistics" && <Statistics roadmap={roadmap} checked={checked} customList={customList} />}
        </div>

      </div>
    </ThemeCtx.Provider>
  );
}