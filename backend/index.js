const multer = require('multer');
const express = require('express');
const cors = require('cors');
const tagEditor = require('./MetadataEditor');
const audioProcessor = require('./AudioEditor');
const parser = require('body-parser');
const path = require('path');
const { exec } = require('child_process');



const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(parser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));



const upload = multer({ dest: 'uploads/' });

app.post('/parseLink', async (req, res) => {
    console.log("parseLink called");``
    const path = req.body.path;
    console.log("path", path);

    try {
        const tags = await tagEditor.parseMetadata(path);
        console.log(path);
        console.log(tags);
        res.status(200).send(tags);

    } catch (error) {
        console.log(error);
        res.status(500).send('error parsing metadata');
    }
})

// parse takes in a file upload input
// already have file in backend, send 
app.post('/parse', upload.single('file'), async (req, res) => {
    const file = req.file;
    console.log("file", file);
    console.log("path", file.path);

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



// input link, url passed as request body
// endpoint to call yt-dlp to download audio file to folder
// return file
// pass file to handleformsubmit...


app.post('/download', async (req, res) => {
    const url = req.body.url;
    console.log("backend received url:", url);


    exec(`yt-dlp ${url} -x --audio-format mp3 -o'uploads/%(title)s.%(ext)s'`, (error, stdout, stderr) => {
        if (error) {
            res.status(500).send('Error occurred while downloading the file.');
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            res.status(500).send('Error occurred while downloading the file.'); 
            console.error(`Stderr: ${stderr}`);
            return;
        }
        
        console.log(`stdout: ${stdout}`);
        const match = stdout.match(/uploads\/.*\.mp3/);
        const downloadedFilePath = match ? match[0] : null;
        console.log("downloaded file path", downloadedFilePath);

        // const title = titleMatch ? titleMatch[1] : 'Unknown Title';
        // console.log(`Downloaded: ${title}`);

        // const match = stdout.match(/Destination:\s*(.*)/);
        // const downloadedFilePath = match ? match[1].trim() : null;
        // console.log("downloaded file path", downloadedFilePath);

        if (downloadedFilePath) {
            console.log(`Downloaded to: ${downloadedFilePath}`);
            try {
                // Store the file in a variable
                const downloadedFile = path.resolve(downloadedFilePath);
                // Send the file path in the response
                res.status(200).json({ file: downloadedFile, filePath: downloadedFilePath});
            } catch (error) {
                console.error('Error parsing metadata:', error);
                res.status(500).send('Error occurred while parsing metadata.');
            }
        } else {
            console.error('Failed to retrieve the downloaded file path.');
            res.status(500).send('Error occurred while retrieving the file path.');
        }
    });

}
);


app.post('/process', async (req, res) => {
    const audioData = req.body;

    console.log("New user inputs", audioData);
    const write = tagEditor.editMetadata(audioData.title, audioData.artist, audioData.album, audioData.filepath);
    console.log("tags written", write);

    try {

        const newTags = await tagEditor.parseMetadata(audioData.filepath);
        console.log("After edits", newTags);

        await tagEditor.editImage(audioData.image, audioData.audio, audioData.filepath);
        const outputPath = path.join(__dirname, '..', 'public', 'processed', `${audioData.title}.mp3`);

        // const outputPath = `processed/${audioData.title}.mp3`;
        await audioProcessor.processAudio(audioData.slow, audioData.reverb, audioData.filepath, outputPath);
        console.log("Audio processed", outputPath);

    } catch (e) {
        console.log(e);
    }


    // edit image


    res.status(200).send({ filename: audioData.title });
});



app.listen(3000, () => {
    console.log('Server running on 3000');
})