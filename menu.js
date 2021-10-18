const { app, Menu, shell } = require("electron")

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

const menu = Menu.buildFromTemplate(template);

module.exports = menu; 