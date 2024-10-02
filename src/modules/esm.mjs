import {join, sep} from 'node:path';
// import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { release, version } from 'node:os'
import { createServer as createServerHttp } from 'node:http';

import { getDirName, getFileName } from "../helpers/getDirName.js";

import './files/c.js';

const __dirname = getDirName(import.meta.url)
const __filename = getFileName(import.meta.url)

const pathToFileA = join(__dirname, './files/a.json')
const pathToFileB = join(__dirname, './files/b.json')

const options = {encoding: 'utf-8'}

const random = Math.random();
let unknownObject;

if (random > 0.5) {
    unknownObject = JSON.parse(await readFile(pathToFileA, options))
} else {
    unknownObject = JSON.parse(await readFile(pathToFileB, options))
}

console.log(`Release ${release()}`);
console.log(`Version ${version()}`);
console.log(`Path segment separator is "\x1b[32m${sep}\x1b[0m"`);

console.log(`Path to current file is \x1b[32m${__filename}\x1b[0m`);
console.log(`Path to current directory is \x1b[32m${__dirname}\x1b[0m`);

const myServer = createServerHttp((_, res) => {
    res.end('Request accepted');
});

const PORT = 3000;

console.log(unknownObject);

myServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log('To terminate it, use Ctrl+C combination');
});

module.exports = {
    unknownObject,
    myServer,
};

