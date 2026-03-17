const { app, BrowserWindow, dialog, shell } = require("electron");
const path = require("path");
const express = require("express");
const http = require("http");
const https = require("https");

const isDev = process.env.NODE_ENV === "development";
const PORT = 3991;
const CURRENT_VERSION = app.getVersion();
const RELEASES_API = "https://api.github.com/repos/ZintelFelix/grudgekeeper/releases/latest";
const RELEASES_PAGE = "https://github.com/ZintelFelix/grudgekeeper/releases/latest";

function startServer() {
    return new Promise((resolve) => {
        const server = express();
        server.use(express.static(path.join(__dirname, "dist")));
        http.createServer(server).listen(PORT, () => resolve());
    });
}

function checkForUpdates(win) {
    https.get(RELEASES_API, { headers: { "User-Agent": "grudgekeeper-app" } }, (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
            try {
                const release = JSON.parse(data);
                const latest = release.tag_name?.replace("v", "");
                if (latest && latest !== CURRENT_VERSION) {
                    dialog.showMessageBox(win, {
                        type: "info",
                        title: "Update available",
                        message: `Grudgekeeper v${latest} is available`,
                        detail: `You are running v${CURRENT_VERSION}. Download the latest version from GitHub.`,
                        buttons: ["Download", "Later"],
                        defaultId: 0,
                    }).then(({ response }) => {
                        if (response === 0) shell.openExternal(RELEASES_PAGE);
                    });
                }
            } catch (_) {}
        });
    }).on("error", () => {});
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

    if (!isDev) {
        setTimeout(() => checkForUpdates(win), 5000);
    }

    return win;
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