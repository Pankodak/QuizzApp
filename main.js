"use strict";

// Import parts of electron to use
const { app, BrowserWindow, ipcMain, Menu, session } = require("electron");
const path = require("path");
const url = require("url");
const BSON = require("bson");
const fs = require("fs");
const bcrypt = require("bcrypt");

const login = "admin";
const password = "$2b$12$G2OnDA7YyNIK7w3TAiQZFe4GdP7dUq8jCddSXHO196Aerm25DzaS2";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false;

// Broken:
// if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
//   dev = true
// }

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "development"
) {
  dev = true;
}

ipcMain.on("addQuestion", (event, args) => {
  fs.readFile("./data.json", (err, data) => {
    if (err) {
      return console.log(err);
    }
    const content = BSON.deserialize(data);
    content[args.system].push({
      title: args.title,
      questions: args.questions,
    });
    const jsonContent = BSON.serialize(content);
    fs.writeFile("./data.json", jsonContent, "utf8", function (err) {
      if (err) {
        return console.log(err);
      }
    });
  });
});

ipcMain.on("removeQuestion", (event, args) => {
  fs.readFile("./data.json", (err, data) => {
    if (err) {
      return console.log(err);
    }
    let content = BSON.deserialize(data);

    content[args.system] = content[args.system].filter(
      (el, index) => index !== args.index
    );
    const dataToClient = JSON.stringify(content);
    mainWindow.webContents.send("repQuestionsAll", dataToClient);
    const jsonContent = BSON.serialize(content);
    fs.writeFile("./data.json", jsonContent, "utf8", function (err) {
      if (err) {
        return console.log(err);
      }
    });
  });
});

ipcMain.on("getQuestions", (event, args) => {
  fs.readFile("./data.json", (err, data) => {
    if (err) {
      return console.log(err);
    }
    const content = BSON.deserialize(data);
    let contentToClient = JSON.stringify(content[1]);
    if (args == "windows") {
      contentToClient = JSON.stringify(content[0]);
    } else if (args == "all") {
      contentToClient = JSON.stringify(content);
      mainWindow.webContents.send("repQuestionsAll", contentToClient);
      return;
    }
    mainWindow.webContents.send("repQuestions", contentToClient);
  });
});

ipcMain.on("tryLogin", (event, loginAndPassword) => {
  if (loginAndPassword.login === login) {
    bcrypt.compare(loginAndPassword.password, password, function (err, result) {
      if (result) {
        mainWindow.webContents.send("repLogin", { auth: 1, err: null });
        return;
      }
      mainWindow.webContents.send("repLogin", {
        auth: 0,
        err: "Nieprawidłowy login i/lub hasło",
      });
      return;
    });
  } else {
    mainWindow.webContents.send("repLogin", {
      auth: 0,
      err: "Nieprawidłowy login i/lub hasło",
    });
  }
});

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minHeight: 1024,
    minWidth: 768,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  let indexPath;

  if (dev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Open the DevTools automatically if developing
    if (dev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log("Error loading React DevTools: ", err)
      );
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

const template = [];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
