const mm = require('music-metadata');

async function readTags(file) {
    try {
        const metadata = await mm.parseFile(file);
        console.log(metadata);
    } catch (e) {
        console.error(e);
    }
}

window.readTags = readTags;
