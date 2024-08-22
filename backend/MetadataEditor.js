const fs = require('fs');
const jsmediatags = require("jsmediatags");
const { title } = require('process');
const NodeID3 = require('node-id3');

class MetadataEditor { 
    static editMetadata(title, artist, album, path) {
        const tags = {
            title,
            artist, 
            album
        }

        const success = NodeID3.write(tags, path)
        return success;
    }

    static async editImage(image, audio) {
        // const mp3tag = new Mp3tag(audio);
        // await mp3tag.read();
    }

    static async parseMetadata(path) {
        return new Promise((resolve, reject) => {
            jsmediatags.read(path, {
                onSuccess: function(tag) {
                    const metadata = {
                        title: tag.tags.title,
                        artist: tag.tags.artist,
                        album: tag.tags.album,
                        filepath: path,
                        image: tag.tags.picture
                    };
                    resolve(metadata);
                },
                onError: function(error) {
                    console.log(':(', error.type, error.info);
                    reject(error);
                }
            })
        });
    }

}

module.exports = MetadataEditor;