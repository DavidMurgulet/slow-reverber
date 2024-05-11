const Mp3tag = require('mp3tag');

class MetadataEditor {
    
    static async editMetadata(audio) {
        const mp3tag = new Mp3tag(audio);
        await mp3tag.read();

    }

    static async readMetadata(buffer) {
        
    }

}

module.exports = MetadataEditor;