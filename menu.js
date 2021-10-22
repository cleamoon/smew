const { 
    app, 
    Menu, 
    shell, 
    BrowserWindow, 
    globalShortcut, 
    dialog 
} = require("electron")

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
                lable: "Dev tools",
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

const { ipcMain } = require("electron");

ipcMain.on("editor-reply", (event, arg) => {
    console.log(`Received reply from web page: ${arg}`);
});

ipcMain.on("save", (event, arg) => {
    console.log(`Saving content of the file`);
    console.log(arg);

    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title: "Save markdown file",
        filters: [
            {
                name: "MyFile",
                extensions: ["md"]
            }
        ]
    };

    dialog.showSaveDialog(window, options, filename => {
        const fs = require('fs');
        if (filename) {
            console.log(`Saving content to the file: ${filename}`);
            fs.writeFileSync(filename, arg);
        }
    });
});

app.on("ready", () => {
    globalShortcut.register("CommandOrontrol+S", () => {
        console.log("Saving the file");
        const window = BrowserWindow.getFocusedWindow();
        window.webContents.send("editor-event", "save");
    });
});