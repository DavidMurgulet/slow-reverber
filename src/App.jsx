import { useState } from 'react'
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import cors from 'cors';
import { Button, Container, Typography, Box, Slider, TextField, Grid } from '@mui/material';
import './App.css';

function App() {
  const [file, setFileState] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [metadata, setMetadata] = useState({
    title: "",
    artist: "",
    album: "",
    image: ""
  });
  const [audioData, setAudioData] = useState({
    title: "",
    artist: "",
    album: "",
    image: "",
    audio: "",
    slow: 0,
    reverb: 0
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (file.type === 'audio/mpeg') {
      const formData = new FormData();
      formData.append("file", file);

      console.log("file made");

      axios.post('/upload', formData)
        .then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error)})



   
        setUploaded(true);
  }
}

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setAudioData({
      ...audioData,
      [name]: value
    });
  }

  const handleSliderChange = (event, newValue, name) => {
    setAudioData({
      ...audioData, [name]: newValue
    });
  }


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileState(file);
  }





  return (
    <Container>
      <Typography variant="h1" align="center">SlowReverber</Typography>
      {!uploaded && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Upload an MP3 file
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <input type="file" onChange={handleFileChange} />
            <Button variant="contained" color="primary" component="span">
              Upload
            </Button>
          </form>
        </Box>
      )}

      {uploaded && (
        <Box mt={4}>
          <Box mt={2}>

            <Typography variant="t1" gutterBottom>Slow Reverber</Typography>
          </Box>



          <Box mt={4}>
            <Typography variant="h5" gutterBottom>Input Fields</Typography>
            <form onSubmit={handleFormSubmit}>

              <Typography variant="h6" gutterBottom>slowness</Typography>
              <Slider defaultValue={50}
                onChange={(event, newValue) => handleSliderChange(event, newValue, 'slow')}
                step={10}
                aria-label="slow" valueLabelDisplay="auto" color="secondary" />

              <Typography variant="h6" gutterBottom>reverb</Typography>
              <Slider defaultValue={50}
                onChange={(event, newValue) => handleSliderChange(event, newValue, 'reverb')}
                step={10}
                aria-label="reverb" valueLabelDisplay="auto" color="primary" />

              <TextField id="outlined-basic"
                onChange={handleTextChange}
                label="Title" defaultValue={metadata.title} />
              <TextField id="outlined-basic"
                onChange={handleTextChange}
                label="Artist" defaultValue={metadata.artist} />
              <TextField id="outlined-basic"
                onChange={handleTextChange}
                label="Album" defaultValue={metadata.album} />

              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </form>
          </Box>
        </Box>
      )}
    </Container>
  );

}


export default App;
