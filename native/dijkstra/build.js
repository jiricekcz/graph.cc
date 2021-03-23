const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
require('colors');



console.log("Building dijkstra...".blue);
console.time("time");
console.log("Configuring gyp...".yellow)
const g2 = childProcess.exec("node-gyp configure");

g2.on("close", () => {
    console.log("Building...".yellow)
    const g = childProcess.exec("node-gyp build");
    g.stdout.pipe(process.stdout);
    g.on("close", () => {
        console.log("Build completed.".green);
        console.log("Moving module...".yellow);
        fs.copyFileSync(path.join(__dirname, "./build/Release/dijkstra.node"), path.join(__dirname, "./module.node"));
        console.log("Module moved.".green);
        if (fs.existsSync(path.join(__dirname, "./dijkstra.d.ts"))) {
            console.log("Moving declaration file...".yellow);
            fs.copyFileSync(path.join(__dirname, "./dijkstra.d.ts"), path.join(__dirname, "./module.d.ts"));
            console.log("Declaration file moved.".green);
        }
        if (!fs.existsSync(path.join(__dirname, "./module.d.ts"))) {
            console.log("Error: No dijkstra declaration file found!".red);
        }
        console.log("Build of dijkstra finished.".blue);
        console.timeEnd("time");
    });
});
g2.stdout.pipe(process.stdout);
