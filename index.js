import { existsSync, lstatSync, readdirSync } from "fs";
import { extname, join, normalize } from "path";
import prompt from "prompt";
import { deleteFiles } from "./utils.js";

const schema = [
    { name: "folderPath", description: "Folder Complete Path", required: false },
];
const ext = ".json";
const filesToBeDeleted = [];
const ignoreFolders = ["node_modules", ".git"];

prompt.start();
prompt.get(schema, (err, res) => {
    const mainPath = normalize(res.folderPath.replace(/"/g, ""));
    getFolders(mainPath);
    deleteFiles(filesToBeDeleted.filter(f => f));
});

function getFolders(mainPath) {
    if (!existsSync(mainPath)) {
        console.log("Folder/File not found");
        return;
    }
    const folders = readdirSync(mainPath);

    folders.forEach(fldr => {
        const fldrPath = join(mainPath, fldr);
        if (ignoreFolders.includes(fldr)) return;

        if (lstatSync(fldrPath).isDirectory()) getFiles(fldrPath, mainPath, fldr);
        else checkAndSaveFile(fldrPath);
    });
}

function getFiles(fldrPath, mainPath, fldr) {
    if (lstatSync(fldrPath).isDirectory()) {
        console.log(`Checking folder > '${fldrPath}'`);
        getFolders(fldrPath);
    } else {
        const files = readdirSync(fldrPath);

        files.forEach((file, ind) => {
            const filePath = join(mainPath, fldr, file);
            checkAndSaveFile(filePath);
        });
    }
}
function checkAndSaveFile(filePath) {
    if (!lstatSync(filePath).isDirectory() && extname(filePath) === ext) filesToBeDeleted.push(filePath);
}