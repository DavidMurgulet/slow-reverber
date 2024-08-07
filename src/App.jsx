import { useState } from 'react'
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import cors from 'cors';
import { Button, Container, Typography, Box, Slider, TextField, Grid } from '@mui/material';
import './App.css';
import PulseLoader from 'react-spinners/PulseLoader';



function App() {
  const [file, setFileState] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadurl, setDownloadUrl] = useState('');
  const [image, setImage] = useState(null);

  const [audioData, setAudioData] = useState({
    title: "",
    artist: "",
    album: "",
    audio: "",
    image: null,
    slow: 0,
    reverb: 0
  });






  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (event.target.files[0]) {
      // const imageArray = file.data f
      // const blob = new Blob([new Uint8Array(imageArray)], { type: file.format });
      const imageUrl = URL.createObjectURL(file);

      setImage(imageUrl);
      setAudioData({
        ...audioData,
        image: imageUrl
      })
      console.log("image updated", imageUrl);
    }
  }

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
    console.log("file changed:", event.target.files[0]);
    const file = event.target.files[0];
    setFileState(file);
  }


  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setFileState(file);
    console.log("file changed to", file);

    if (file.type === 'audio/mpeg') {
      console.log("file is audio");
      const formData = new FormData();
      formData.append("file", file);

      await axios.post('http://localhost:3000/parse', formData)
        .then((response) => {
          console.log("response received", response.data.image);
          setTitle(response.data.title);
          setArtist(response.data.artist);
          setAlbum(response.data.album);
          setPath(response.data.filepath);
          if (response.data.image) {
            console.log("image found", response.data.image.data);
            const imageArray = response.data.image.data;
            const blob = new Blob([new Uint8Array(imageArray)], { type: response.data.image.format });
            const imageUrl = URL.createObjectURL(blob);
            setImage(imageUrl);
            console.log("image url", imageUrl);
          } else if (response.data.image === undefined) {
            console.log("no image found");
            setImage("No-Image-Placeholder.svg");
          }
        }).catch((error) => {
          console.log(error)
        })
    } else {
      console.log("file not audio");
    }
    setUploaded(true);
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
      image: audioData.image,
      slow: audioData.slow,
      reverb: audioData.reverb,
      filepath: path
    }

    console.log("updated data", updatedData.image);

    await axios.post('http://localhost:3000/process', updatedData)
      .then((response) => {
        console.log(response);
        const filename = response.data.filename; // Filename returned from server
        const url = `http://localhost:5173/processed/${filename}` + '.mp3';
        setDownloadUrl(url);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }




  return (
    <div className="flex flex-col items-center justify-start">

      {!uploaded && (<div className="pb-40 w-96 flex flex-col items-center justify-center">
        <h1 className="text-black text-6xl pb-8">SloReverber</h1>
        <h6 class="text-black text-8">Upload a song to get started</h6>
      </div>
      )}

      {!uploaded && (


        <div className="flex flex-grow justify-center items-center w-full mb-60">

          <form onSubmit={handleFormSubmit}>
            <label
              htmlFor="uploadFile1"
              className="flex bg-gray-800 hover:bg-gray-700 text-white text-base px-5 py-3 outline-none w-max rounded-3xl cursor-pointer font-sans"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 mr-2 fill-white inline"
                viewBox="0 0 32 32"
              >
                <path
                  d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                  data-original="#000000"
                />
                <path
                  d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                  data-original="#000000"
                />
              </svg>
              Upload
              <input
                type="file"
                id="uploadFile1"
                className="hidden"
                onChange={handleFormSubmit}
              />
            </label>
          </form>
        </div>
      )}

      {uploaded && (
        <div className="w-full mt-4">
          <div className="text-center">
            {/* what is this heading */}
            {/* <h5 className="text-xl font-semibold mb-2">Slow Reverber</h5> */}
          </div>
          {!loading && !downloadurl && (
            <div className="mt-4 px-4 space-y-8 mb-60">

              <form onSubmit={handleFormSubmit2} className="flex items-center justify-center space-x-40">

                <div class="flex flex-col justify-center space-y-40">
                  <div class="flex align-center space-x-60">
                    {/* slider div */}
                    <div class="flex flex-col justify-center space-y-4 w-96">
                      <h6 className="text-lg font-semibold mb-2">Slowness</h6>
                      <input type="range" min="0" max="100" defaultvalue="25" class="range" step="10"
                        onChange={(event) => handleSliderChange(event, event.target.value, 'slow')} />
                      <div class="flex w-full justify-between px-2 text-xs">
                      </div>

                      <h6 className="text-lg font-semibold mb-2">Reverb</h6>
                      <input type="range" min="0" max="100" defaultvalue="10" class="range" step="10"
                        onChange={(event) => handleSliderChange(event, event.target.value, 'reverb')} />
                    </div>
                    {/* metadata div */}
                    <div class="flex items-start space-x-4">

                      {/* metadata title on top of div containing  */}
                      <div class="flex flex-col justify-center space-y-4">

                        <div class="flex justify-center">
                          <h6 className="text-lg font-semibold mb-2">Metadata</h6>
                        </div>

                        <div class="flex space-x-8">
                          <div label="fields-container" class="flex justify-center flex-col">
                            <div className="mb-4">
                              <label class="block text-sm font-medium text-gray-700">
                                Title
                                <input
                                  type="text"
                                  id="title"
                                  name="title"
                                  onChange={handleTextChange}
                                  defaultValue={title}
                                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                />
                              </label>
                            </div>

                            <div className="mb-4">
                              <label class="block text-sm font-medium text-gray-700">
                                Artist
                                <input
                                  type="text"
                                  id="artist"
                                  name="artist"
                                  onChange={handleArtistChange}
                                  defaultValue={artist}
                                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                />
                              </label>
                            </div>

                            <div className="mb-4">
                              <label class="block text-sm font-medium text-gray-700">
                                Album
                                <input
                                  type="text"
                                  id="album"
                                  name="album"
                                  onChange={handleTextChange}
                                  defaultValue={album}
                                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                />
                              </label>
                            </div>

                          </div>

                          <div class="flex items-center justify-center">
                            <div class="relative">
                              <label for="image" class="cursor-pointer">
                                <img
                                  src={image || "https://www.flaticon.com/svg/static/icons/svg/64/64572.svg"}
                                  alt="Example"
                                  class="w-64 h-64 object-cover rounded-lg shadow-lg bg-white opacity-100 z-10 transition-opacity duration-200 hover:opacity-85 hover:shadow-none"
                                />
                                <input
                                  type="file"
                                  id="image"
                                  name="image"
                                  class="hidden"
                                  onChange={handleImageChange}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4 w-full">
                    <button
                      type="submit"
                      className="bg-gray-800 text-white px-6 py-3 rounded-3xl text-lg"
                    >
                      Submit Audio
                    </button>
                  </div>
                </div>



              </form>

            </div>
          )}
          {loading && (
            <div className="flex justify-center mt-4">
              <span class="loading loading-dots loading-lg"></span>
            </div>
          )}
          {downloadurl && (
            <div className="flex justify-center mt-4">
              <a href={downloadurl} download>
                <div class="flex items-center align-top pb-20 flex-col justify-center">
                <h1 className="text-black text-6xl pb-60">SloReverber</h1>
                  <div class="relative">
                    <label for="image">
                      <img
                        src={image || "https://www.flaticon.com/svg/static/icons/svg/64/64572.svg"}
                        alt="Example"
                        class="w-64 h-64 object-cover rounded-lg shadow-lg"
                      />

                    </label>
                  </div>
                </div>
                <button className="bg-gray-800 text-white px-4 py-2 rounded-3xl">
                  Download
                </button>
              </a>
            </div>
          )}
        </div>
      )}


    </div>




    // <Container>
    //   <div className='justify-center h-80'>
    //     <h1 class="text-black text-6xl m-0" >SloReverber</h1>

    //   </div>

    //   {!uploaded && (
    //     <Box mt={4}>
    //       <form onSubmit={handleFormSubmit}>
    //         <label for="uploadFile1" class="flex bg-gray-800 hover:bg-gray-700 text-white text-base px-5 py-3 outline-none w-max rounded-3xl cursor-pointer mx-auto  font-[sans-serif]">
    //           <svg xmlns="http://www.w3.org/2000/svg" class="w-6 mr-2 fill-white inline" viewBox="0 0 32 32">
    //             <path d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" data-original="#000000" />
    //             <path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" data-original="#000000" />
    //           </svg>
    //           Upload
    //           <input type="file" id="uploadFile1" class="hidden" onChange={handleFormSubmit} />
    //         </label>
    //       </form>

    //     </Box>
    //   )}

    //   {uploaded && (
    //     <Box mt={4}>
    //       <Box mt={2}>
    //         <Typography variant="h5" gutterBottom>Slow Reverber</Typography>
    //       </Box>
    //       {!loading && !downloadurl && (
    //         <Box mt={4}>
    //           <Typography variant="h5" gutterBottom>Input Fields</Typography>
    //           <form onSubmit={handleFormSubmit2}>
    //             <Typography variant="h6" gutterBottom>Slowness</Typography>
    //             <Slider
    //               defaultValue={50}
    //               onChange={(event, newValue) => handleSliderChange(event, newValue, 'slow')}
    //               step={10}
    //               aria-label="slow"
    //               valueLabelDisplay="auto"
    //               color="secondary"
    //             />

    //             <Typography variant="h6" gutterBottom>Reverb</Typography>
    //             <Slider
    //               defaultValue={50}
    //               onChange={(event, newValue) => handleSliderChange(event, newValue, 'reverb')}
    //               step={10}
    //               aria-label="reverb"
    //               valueLabelDisplay="auto"
    //               color="primary"
    //             />

    //             <TextField
    //               id="outlined-basic"
    //               onChange={handleTextChange}
    //               label="Title"
    //               name="title"
    //               defaultValue={title}
    //             />
    //             <TextField
    //               id="outlined-basic"
    //               onChange={handleArtistChange}
    //               label="Artist"
    //               name="artist"
    //               defaultValue={artist}
    //             />
    //             <TextField
    //               id="outlined-basic"
    //               // onChange={handleAlbumChange}
    //               label="Album"
    //               name="album"
    //               defaultValue={album}
    //             />

    //             <Button variant="contained" color="primary" type="submit">
    //               Submit
    //             </Button>
    //           </form>
    //         </Box>
    //       )}
    //       {loading && (
    //         <Box display="flex" justifyContent="center" mt={4}>
    //           <PulseLoader color={"#36D7B7"} />
    //         </Box>
    //       )}
    //       {downloadurl && (
    //         <Box display="flex" justifyContent="center" mt={4}>
    //           <a href={downloadurl} download>
    //             <Button variant="contained" color="primary">
    //               Download Processed File
    //             </Button>
    //           </a>
    //         </Box>
    //       )}
    //     </Box>
    //   )}
    // </Container>
  );

}


export default App;
