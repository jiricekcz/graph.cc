const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')
require('colors')



async function main() {
    console.time("All");
    console.log("Compiling typescript...".yellow);
    console.time("time");
    await run("tsc");
    console.log("Typescript compiled.".green);
    console.timeEnd("time");
    dir = fs.readdirSync(path.join(__dirname, "./native/"));
    for (var e of dir) {
        let s = fs.statSync(path.join(__dirname, "native", e));
        if (s.isDirectory()) {
            if (fs.existsSync(path.join(__dirname, "native", e, "build.js"))) {
                await run(`cd ./native/${e} && node build.js`);
            } else {
                console.log("Error: Module ".red + (e + "").cyan + " doesn't have a build.js directive. Cannot build module.".red);
            }
        } else {
            console.log("Warn: File ".yellow + (e + "").cyan + " found in directory native. File cannot be considered a module.".yellow);
        }
    }
    console.timeEnd("All");
}
function run(command) {
    return new Promise((resolve) => {
        const p = childProcess.exec(command);
        p.on("close", () => {
            resolve();
        });
        p.stdout.pipe(process.stdout);
    })
}
main();
