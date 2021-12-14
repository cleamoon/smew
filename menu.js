const {
    app,
    Menu,
    shell,
    ipcMain,
    BrowserWindow,
    globalShortcut,
    dialog
} = require("electron")

const fs = require("fs");

const template = [
    {
        role: "help",
        submenu: [
            {
                label: "About Editor Component",
                click() {
                    shell.openExternal("https://simplemde.com/");
                }
            }
        ]
    },
    {
        label: "Format",
        submenu: [
            {
                label: "Toggle Bold",
                click() {
                    const window = BrowserWindow.getFocusedWindow();
                    window.webContents.send(
                        'editor-event',
                        'toggle-bold'
                    );
                }
            }
        ]
    }
];

if (process.platform === "darwin") {
    template.unshift({
        label: app.getName(),
        submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "quit" }
        ]
    })
}

if (process.env.DEBUG) {
    template.push({
        label: "Debugging",
        submenu: [
            {
                label: "Dev tools",
                role: "toggleDevTools"
            },

            {
                type: "separator"
            },

            {
                role: "reload",
                accelerator: "Alt+R"
            }
        ]
    });
}

const menu = Menu.buildFromTemplate(template);

module.exports = menu;

const path = require("path");

ipcMain.on("editor-reply", (event, arg) => {
    console.log(`Received reply from web page: ${arg}`);
});

ipcMain.on("save", (event, arg) => {
    //console.log(`Saving content of the file`);
    //console.log(arg);

    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Save markdown file',
        filters: [
            {
                name: "MyFile",
                extensions: ["md"]
            }, 
            {
                name: "All files",
                extensions: ["*"]
            }
        ]
    };

    dialog.showSaveDialog(window, options)
        .then(result => {
            fs.writeFileSync(result.filePath, arg);
            console.log(`Saving content to the file: ${result.filePath}`);    
        }).catch(err => {
            console.log(err)
        });
});


app.on("ready", () => {
    globalShortcut.register("CommandOrControl+S", () => {
        const window = BrowserWindow.getFocusedWindow();
        window.webContents.send("editor-event", "save");
        console.log("Saving the file");
    });

    globalShortcut.register("CommandOrControl+O", () => {
        const window = BrowserWindow.getFocusedWindow();

        const options = {
            title: 'Pick a markdown file',
            filters: [
                { name: "Markdown files", extensions: ["md"] },
                { name: "Text files", extensions: ["txt"] }
            ]
        };

        dialog.showOpenDialog(window, options)
        .then(result => {
            const content = fs.readFileSync(result.filePaths[0]).toString();
            console.log(`Opening file: ${result.filePaths[0]}`);    
            window.webContents.send("load", content);
        }).catch(err => {
            console.log(err)
        });
    });
});