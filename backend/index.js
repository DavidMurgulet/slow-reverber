const multer = require('multer');
const express = require('express');
const cors = require('cors');
const tagEditor = require('./MetadataEditor');
const audioProcessor = require('./AudioEditor');
const parser = require('body-parser');
const path = require('path');


const app = express();

// app.use(cors());

app.use(cors({
    origin: 'http://localhost:5173'
  }));

app.use(parser.json());


const upload = multer( { dest: 'uploads/' } );

app.post('/parse', upload.single('file'), async (req, res) => {
    const file = req.file;

    try {
        const tags = await tagEditor.parseMetadata(file.path);
        console.log(file.path);
        res.status(200).send(tags);

    } catch (error) {  
        console.log(error);
        res.status(500).send('error parsing metadata');
    }
});

app.use('/processed', express.static(path.join(__dirname, 'processed')));

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'processed', filename);
  
    res.download(filePath, filename, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error downloading file');
      }
    });
  });
  


app.post('/process', async (req, res) => {
    const audioData = req.body;

    console.log("New user inputs", audioData);
    const write = tagEditor.editMetadata(audioData.title, audioData.artist, audioData.album, audioData.filepath);
    console.log("tags written", write);

    try {
         
        const newTags = await tagEditor.parseMetadata(audioData.filepath);
        console.log("After edits", newTags);

        await tagEditor.editImage(audioData.image, audioData.audio, audioData.filepath);

        const outputPath = `processed/${audioData.title}.mp3`;
        await audioProcessor.processAudio(audioData.slow, audioData.reverb, audioData.filepath, outputPath);
        console.log("Audio processed", outputPath);

        

    } catch (e) {
        console.log(e);
    }
    

    // edit image
   

    res.status(200).send({filename: audioData.title});
});



app.listen(3000, () => {
    console.log('Server running on 3000');
})