import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';


export function syncApi() {

    //check if there is ../daily-money-one-desk/dist/mainfest.json, read it
    const apiDefinitionPath = path.resolve(process.cwd(), '../daily-money-one-api/dist/api-definition.json')

    if (!fs.existsSync(apiDefinitionPath)) {
        console.error(`Api definition file does not exist: ${apiDefinitionPath}`);
        return null;
    }
    
    const apiDefinitionDistPath = path.resolve(process.cwd(), './dist/api-definition.json')
    console.log(`Copy ${apiDefinitionPath} to ${apiDefinitionDistPath}`)
    fs.copyFileSync(apiDefinitionPath, apiDefinitionDistPath);
}

function main() {
    syncApi()
}

//in es moudle project to execute cli by ts-node
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
    main();
}