import { readPly, readPlyOld } from './src/framework/parsers/ply.js';
import { Readable } from 'stream';
import { readFileSync } from 'node:fs';

const filePath = 'examples/assets/splats/guitar.ply';
const fileBuffer = readFileSync(filePath);

const methods = new Map([
    ['before', readPlyOld],
    ['after', readPly]
]);

for (const [name, method] of methods) {
    var times = [];
    for (let i = 0; i < 100; i++) {
        const readableStream = new Readable({
            read() {
                this.push(fileBuffer);
                this.push(null);
            }
        });
        const webReadableStream = Readable.toWeb(readableStream);
        const reader = webReadableStream.getReader();

        const begin = new Date();
        await method(reader);
        const end = new Date();
        times.push(end - begin);
    }
    console.log(`${name}: ${times.reduce((a, b) => a + b, 0) / times.length} ms`);
}
