const multer = require('multer');
const express = require('express');
const cors = require('cors');
const AudioEditor = require('./AudioEditor');

const app = express();
const upload = multer({dest: 'uploads/'});


// 1. user uploads 
// 2. slow + reverb ui appears.
//    available meta data is also presented. 
// 3. user changes metadata and sliders for reverb slow
// 4. submit -> loading screen -> file download

app.post('localhost:5173/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    console.log("received request", file);
    res.send('File uploaded and stored successfully');
});

// app.get( => {

// });

// app.post('/api/upload', (req, res) => {  
//     const { title, artist, album, image, audio, slow, reverb } = req.body;

//     const slowedAudio = AudioEditor.processAudio(audio, slow, reverb);

//     // edit slowedAudio metadata 
    
//     if (!req.file) {
//         return res.status(400).send('file upload err');
//     }

//     // try {
//         const audioBuffer = req.file.buffer;

//         const outFile =   `processed_${req.file.originalname}`;
    
//         // const slowedAudio = await AudioEditor.processAudio(audio);
//         // const metadata = await MetadataEditor.readMetadata(audioBuffer);

//         // image
//         // title
//         // artist
//         // album 
    
//     // } catch (e) {/

//     // }

// });





app.listen(3000, () => {
    console.log('Server running on 3000');
})