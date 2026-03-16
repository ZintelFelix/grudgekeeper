import { createContext, useContext } from "react";

export const DARK = {
    bg: "#080503",
    bg2: "rgba(18,10,4,0.85)",
    bg3: "rgba(255,220,140,0.03)",
    border: "rgba(160,90,20,0.22)",
    borderHover: "rgba(200,140,40,0.38)",
    text1: "#f0ddb0",
    text2: "#c8a86a",
    text3: "#9a7840",
    text4: "#6a5028",
    text5: "#775b2a",
    accent: "#c8920a",
    accentGlow: "rgba(200,146,10,0.12)",
    sidebar: "rgba(8,4,2,0.72)",
    topbar: "rgba(6,3,1,0.55)",
    input: "rgba(255,200,80,0.04)",
    inputBorder: "rgba(160,90,20,0.28)",
    checkDone: "rgba(74,222,128,0.10)",
    checkBorder: "#4ade80",
};

export const LIGHT = {
    bg: "#bdb5a4",
    bg2: "rgba(185,177,164,0.92)",
    bg3: "rgba(30,20,8,0.04)",
    border: "rgba(100,70,10,0.20)",
    borderHover: "rgba(140,100,10,0.38)",
    text1: "#120c04",
    text2: "#251808",
    text3: "#3a2810",
    text4: "#52381a",
    text5: "#6a4e28",
    accent: "#d4980c",
    accentGlow: "rgba(212,152,12,0.14)",
    sidebar: "rgba(168,158,144,0.88)",
    topbar: "rgba(178,168,154,0.80)",
    input: "rgba(30,20,8,0.05)",
    inputBorder: "rgba(100,70,10,0.22)",
    checkDone: "rgba(122,180,60,0.14)",
    checkBorder: "#5a8a20",
};

export const ThemeCtx = createContext();
export const useTheme = () => useContext(ThemeCtx);