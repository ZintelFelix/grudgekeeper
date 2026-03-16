const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");
const http = require("http");

const isDev = process.env.NODE_ENV === "development";
const PORT = 3991;

function startServer() {
    return new Promise((resolve) => {
        const server = express();
        server.use(express.static(path.join(__dirname, "dist")));
        http.createServer(server).listen(PORT, () => resolve());
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1100,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        titleBarStyle: "default",
        title: "Grudgekeeper — Campaign Chronicles",
        backgroundColor: "#080503",
    });

    if (isDev) {
        win.loadURL("http://localhost:5173");
    } else {
        win.loadURL(`http://localhost:${PORT}`);
    }

    win.setMenuBarVisibility(false);
}

app.whenReady().then(async () => {
    if (!isDev) await startServer();
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});