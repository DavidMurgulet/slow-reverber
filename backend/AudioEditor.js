const ffmpeg = require('fluent-ffmpeg');

class AudioEditor {

    static async processAudio(audio) {
        
   
        ffmpeg(audio)
        // reverb
        .audioFilters()
        // tempo + pitch
        .audioFilters()
        .on

    }
}

module.exports = AudioEditor;