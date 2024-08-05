import { useState } from 'react'
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import cors from 'cors';
import { Button, Container, Typography, Box, Slider, TextField, Grid } from '@mui/material';
import './App.css';
import PulseLoader from 'react-spinners/PulseLoader';

// TODO: finish audio processing + tag editing.

function App() {
  const [file, setFileState] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadurl, setDownloadUrl] = useState('');

  const [audioData, setAudioData] = useState({
    title: "",
    artist: "",
    album: "",
    audio: "",
    slow: 0,
    reverb: 0
  });


  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (file.type === 'audio/mpeg') {
      console.log("file is audio");
      const formData = new FormData();
      formData.append("file", file);

      await axios.post('http://localhost:3000/parse', formData)
        .then((response) => {
          console.log("response received");
          setTitle(response.data.title);
          setArtist(response.data.artist);
          setAlbum(response.data.album);
          setPath(response.data.filepath);
        }).catch((error) => {
          console.log(error)
        })
    } else {
      console.log("file not audio");
    }
    setUploaded(true);
  }

  const triggerDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const handleTextChange = (event) => {
    const { name, value } = event.target;
    console.log(value);
    setAudioData(prevAudioData => ({
      ...prevAudioData,
      [name]: value
    }));
  }

  const handleArtistChange = (event) => {
    const { name, value } = event.target;
    console.log(value);
    setAudioData({
      ...audioData, [name]: value
    });
  }

  const handleSliderChange = (event, newValue, name) => {
    console.log(newValue);
    setAudioData({
      ...audioData, [name]: newValue
    });
  }

  const handleFileChange = (event) => {
    console.log("file changed");
    const file = event.target.files[0];
    setFileState(file);
  }

  const handleFormSubmit2 = async (event) => {
    event.preventDefault();
    setLoading(true);
    setDownloadUrl('');

    const { elements } = event.target;

    const updatedData = {
      title: elements.title.value,
      artist: elements.artist.value,
      album: elements.album.value,
      audio: audioData.audio,
      slow: audioData.slow,
      reverb: audioData.reverb,
      filepath: path
    }

    console.log("updated data", updatedData);

    await axios.post('http://localhost:3000/process', updatedData)
      .then((response) => {
        console.log(response);
        const filename = response.data.filename; // Filename returned from server
        const url = `http://localhost:3000/processed/${filename}`+ '.mp3';
        setDownloadUrl(url);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }




  return (
    <Container>
      <Typography variant="h1" align="center">SlowReverber</Typography>
      {!uploaded && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Upload an MP3 file</Typography>
          <form onSubmit={handleFormSubmit}>
            <input type="file" onChange={handleFileChange} />
            <Button variant="contained" color="primary" type="submit">Upload</Button>
          </form>
        </Box>
      )}

      {uploaded && (
        <Box mt={4}>
          <Box mt={2}>
            <Typography variant="h5" gutterBottom>Slow Reverber</Typography>
          </Box>
          {!loading && !downloadurl && (
            <Box mt={4}>
              <Typography variant="h5" gutterBottom>Input Fields</Typography>
              <form onSubmit={handleFormSubmit2}>
                <Typography variant="h6" gutterBottom>Slowness</Typography>
                <Slider
                  defaultValue={50}
                  onChange={(event, newValue) => handleSliderChange(event, newValue, 'slow')}
                  step={10}
                  aria-label="slow"
                  valueLabelDisplay="auto"
                  color="secondary"
                />

                <Typography variant="h6" gutterBottom>Reverb</Typography>
                <Slider
                  defaultValue={50}
                  onChange={(event, newValue) => handleSliderChange(event, newValue, 'reverb')}
                  step={10}
                  aria-label="reverb"
                  valueLabelDisplay="auto"
                  color="primary"
                />

                <TextField
                  id="outlined-basic"
                  onChange={handleTextChange}
                  label="Title"
                  name="title"
                  defaultValue={title}
                />
                <TextField
                  id="outlined-basic"
                  onChange={handleArtistChange}
                  label="Artist"
                  name="artist"
                  defaultValue={artist}
                />
                <TextField
                  id="outlined-basic"
                  // onChange={handleAlbumChange}
                  label="Album"
                  name="album"
                  defaultValue={album}
                />

                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </form>
            </Box>
          )}
          {loading && (
            <Box display="flex" justifyContent="center" mt={4}>
              <PulseLoader color={"#36D7B7"} />
            </Box>
          )}
          {downloadurl && (
            <Box display="flex" justifyContent="center" mt={4}>
             <a href={downloadurl} download>
                <Button variant="contained" color="primary">
                  Download Processed File
                </Button>
              </a>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );

}


export default App;
