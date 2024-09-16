import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';


export function syncApi() {

    const apiProjectPath = path.resolve(process.cwd(), '../daily-money-one-api')
    //sync api model
    {
        const clientPath = path.resolve(apiProjectPath, './gen/client')
        if (!fs.existsSync(clientPath)) {
            console.error(`Client directory does not exist: ${clientPath}`);
            return null;
        }

        const desktopClientPath = path.resolve(process.cwd(), './sync/client')
        if (fs.existsSync(desktopClientPath)) {
            console.log(`Clear old gen client directory ${desktopClientPath}`)
            clearDirectory(desktopClientPath)
        } else {
            fs.mkdirSync(desktopClientPath, { recursive: true })
        }

        console.log(`Copy ${clientPath} to ${desktopClientPath}`)
        copyDirectory(clientPath, desktopClientPath)
    }
}


function clearDirectory(directoryPath: string) {
    const absolutePath = path.resolve(directoryPath);
    const files = fs.readdirSync(absolutePath);
    for (const file of files) {
        const filePath = path.join(absolutePath, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
        } else {
            fs.unlinkSync(filePath);
        }
    }
}

function copyDirectory(source: string, destination: string): void {
    const sourcePath = path.resolve(source);
    const destinationPath = path.resolve(destination);

    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
    }
    const items = fs.readdirSync(sourcePath);

    for (const item of items) {
        const sourceItemPath = path.join(sourcePath, item);
        const destinationItemPath = path.join(destinationPath, item);
        const stat = fs.statSync(sourceItemPath);

        if (stat.isDirectory()) {
            copyDirectory(sourceItemPath, destinationItemPath);
        } else {
            const destPath = `${destinationItemPath}`
            fs.copyFileSync(sourceItemPath, destPath);
        }
    }
}

function main() {
    syncApi()
}

//in es moudle project to execute cli by ts-node
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
    main();
}