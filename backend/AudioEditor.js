// const path = require('path');
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfmpegPath(ffmpegPath);
// const sox = require('sox');

// class AudioEditor {
//     static async processAudio(slow, reverb, inputPath, outputFilePath) {
//         return new Promise((resolve, reject) => {
//             let reverbEffect = '';
//             let speedEffect = 1;
//             let tempoEffect = `atempo=1`;

//             if (reverb > 0) {
//                 reverbEffect = `aecho=0.8:0.88:${reverb}:0.4`;
//             }

//             if (slow > 0) {
//                 speedEffect = 1 - (slow / 100);
//                 tempoEffect = `atempo=${speedEffect}`;
//             }

//             ffmpeg(inputPath).audioFilters([
//                 reverbEffect,
//                 tempoEffect,
//             ].filter(Boolean))
//             .on('end', () => resolve(outputFilePath))
//             .on('error', reject)
//             .save(outputFilePath);
//         });
//     }
// }

const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const execPromise = promisify(exec);

class AudioEditor {
    static async processAudio(slow, reverb, inputPath, outputFilePath) {
        return new Promise((resolve, reject) => {
            let reverbEffect = '';
            let slowEffect = '';

            if (reverb > 0) {
                reverbEffect = `aecho=0.8:0.88:${reverb}:0.4`;
            }

            if (slow > 0) {
                const speedEffect = 1 - (slow / 100);
                const newSampleRate = 44100 * speedEffect; // assuming original sample rate is 44100
                slowEffect = `asetrate=${newSampleRate},aresample=44100`;
            }


            ffmpeg(inputPath)
                .audioFilters([
                    reverbEffect,
                    slowEffect,
                ].filter(Boolean))
                .on('end', () => resolve(outputFilePath))
                .on('error', reject)
                .save(outputFilePath);
        });
    }
}


module.exports = AudioEditor;