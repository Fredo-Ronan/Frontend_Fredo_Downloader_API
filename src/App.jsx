import { useState } from "react";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
import muxjs from "mux.js";
import { mp2t } from "mux.js";
const { TransportDemuxStream } = mp2t;

import instagram from "./assets/instagram.png";
import youtube from "./assets/youtube.png";

import "./App.css";
import {
  CheckLink,
  DownloadInstagram,
  DownloadYoutube,
} from "./api/apiFunctions";

function App() {
  const [isChoosen, setIsChoosen] = useState(false);
  const [choose, setChoose] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Instagram Side Constants
  const [igLink, setIgLink] = useState("");
  const [validIGLink, setValidIGLink] = useState(false);
  const [instagramVideo, setInstagramVideo] = useState("");
  const [instagramAudio, setInstagramAudio] = useState("");

  // Youtube Side Constants
  const [ytLink, setYtLink] = useState("");
  const [validYTLink, setValidYTLink] = useState(false);
  const [youtubeVideo, setYoutubeVideo] = useState("");
  const [youtubeAudio, setYoutubeAudio] = useState("");

  // Back To Home Handler
  const backToHomeIG = () => {
    setChoose("");
    setIgLink("");
    setValidIGLink(false);
    setInstagramAudio("");
    setInstagramVideo("");
    setIsChoosen(false);
  };

  const backToHomeYT = () => {
    setChoose("");
    setYtLink("");
    setValidYTLink(false);
    setYoutubeVideo("");
    setIsChoosen(false);
  };

  // Instagram Side Functions
  const fetchInstagram = (url) => {
    setIsLoading(true);
    DownloadInstagram(url)
      .then((result) => {
        console.log(result.video);
        setInstagramVideo(result.video);
        setInstagramAudio(result.audio);
        setIsLoading(false);
        setValidIGLink(true);
      })
      .catch((err) => {
        console.log(err);
        setValidIGLink(false);
        setChoose("");
      });
  };

  const inputIGLinkHandler = (value) => {
    setIgLink(value);

    if (value.includes("https://www.instagram.com/")) {
      fetchInstagram(value);
    }
  };

  const instagramClick = () => {
    setIsChoosen(!isChoosen);
    setChoose("ig");
  };

  // Youtube Side Functions
  const mergeVideoAudio = async (videoUrl, audioUrl) => {
    try {
      // const proxy = 'https://cors-anywhere.herokuapp.com/';
      // Fetch video and audio data
      const binaryVideo = atob(videoUrl);
      const binaryAudio = atob(audioUrl);

      const videoData = new Uint8Array(binaryVideo.length);
      const audioData = new Uint8Array(binaryAudio.length);

      for (let i = 0; i < binaryVideo.length; i++) {
        videoData[i] = binaryVideo.charCodeAt(i);
      }

      for (let i = 0; i < binaryAudio.length; i++) {
        audioData[i] = binaryAudio.charCodeAt(i);
      }

      // Create Mux.js transport streams for video and audio
      const videoStream = new muxjs.mp2t.TransportPacketStream({
        type: "video",
      });
      const audioStream = new muxjs.mp2t.TransportPacketStream({
        type: "audio",
      });

      // Push video and audio data to streams
      videoStream.push({ data: videoData });
      audioStream.push({ data: audioData });

      // Create a Mux.js demuxer to merge video and audio
      const demuxer = new TransportDemuxStream({
        keepOriginalTimestamps: true,
      });
      videoStream.pipe(demuxer);
      audioStream.pipe(demuxer);

      // Listen for 'data' events to get the merged data
      demuxer.on("data", (chunk) => {
        // Handle merged data (chunk)
        // For example, you can create a Blob and trigger a download
        const blob = new Blob([chunk], { type: "video/mp4" });
        const videoLink = URL.createObjectURL(blob);

        console.log("Merging finished");

        return videoLink;
      });
    } catch (error) {
      console.error("Error during merging:", error);
    }
  };
  // const mergeVideoAudio = async (videoUrl, audioUrl) => {
  //   try {
  //     // Run FFmpeg command to merge video and audio
  //     const mergeProcess = spawn(ffmpeg, [
  //       '-i', videoUrl,
  //       '-i', audioUrl,
  //       '-c', 'copy',
  //       'output.mp4',
  //     ]);

  //     mergeProcess.stdout.on('data', (data) => {
  //       console.log(`stdout: ${data}`);
  //     });

  //     mergeProcess.stderr.on('data', (data) => {
  //       console.error(`stderr: ${data}`);
  //     });

  //     mergeProcess.on('close', (code) => {
  //       console.log(`child process exited with code ${code}`);

  //       // Get the merged file
  //       const mergedData = fs.readFileSync('output.mp4');

  //       // Create a blob from the merged data
  //       const blob = new Blob([mergedData], { type: 'video/mp4' });
  //       const videoLink = URL.createObjectURL(blob);

  //       return videoLink;
  //     });
  //   } catch (error) {
  //     console.error('Error during merging:', error);
  //   }
  // };

  const fetchYoutube = (url) => {
    setIsLoading(true);
    DownloadYoutube(url)
      .then(async (res) => {
        console.log(res.video);
        console.log(res.audio);
        // const videoLink = await mergeVideoAudio(res.video, res.audio);

        // console.log(videoLink);
        setYoutubeVideo(res.video);
        setYoutubeAudio(res.audio);
        setIsLoading(false);
        setValidYTLink(true);
      })
      .catch((err) => {
        console.log(err);
        setValidYTLink(false);
        setChoose("");
      });
  };

  const inputYTLinkHandler = (value) => {
    setYtLink(value);

    if (value.includes("https://www.youtube.com/")) {
      fetchYoutube(value);
    }
  };

  const youtubeClick = () => {
    setIsChoosen(!isChoosen);
    setChoose("yt");
  };

  return (
    <div className="main">
      <div className="head">
        {isChoosen ? (
          <>
            {choose === "ig" ? (
              <>
                <h2>Instagram Downloader</h2>
                <p>Paste the instagram link</p>
              </>
            ) : (
              <>
                <h2>Youtube Downloader (BETA)</h2>
                <p style={{ fontStyle: "italic" }}>
                  Note that this youtube downloader is still in BETA version, so
                  it's not very stable yet
                </p>
                <p>Paste the Youtube link</p>
              </>
            )}
          </>
        ) : (
          <>
            <h2>Welcome to Fredo Downloader</h2>
            <p>You can choose one of these downloader</p>
          </>
        )}
      </div>
      <div className="main-container">
        {isChoosen ? (
          <>
            {/* Instagram Downloader */}
            {choose === "ig" ? (
              <div className="d-flex justify-content-center align-items-center flex-column">
                <div>
                  <button
                    className="btn btn-danger mb-4"
                    onClick={backToHomeIG}
                  >
                    Go Back to Home
                  </button>
                </div>
                <div className="ig-input">
                  <input
                    type="text"
                    className="form-control"
                    value={igLink}
                    onChange={(e) => inputIGLinkHandler(e.target.value)}
                    placeholder="paste instagram link here..."
                  />
                </div>
                {isLoading ? (
                  <>
                    <div className="d-flex justify-content-center mt-4">
                      <Spinner animation="border" size="lg" />
                    </div>
                  </>
                ) : (
                  <>
                    {validIGLink ? (
                      <>
                        <div className="d-flex justify-content-center mt-4">
                          <div className="d-flex justify-content-center flex-wrap gap-4">
                            {instagramAudio === null ? (
                              <>
                                <a
                                  href={instagramVideo}
                                  target="_blank"
                                  style={{
                                    color: "white",
                                    textDecoration: "none",
                                  }}
                                >
                                  <button className="btn btn-success">
                                    Download Video
                                  </button>
                                </a>
                              </>
                            ) : (
                              <>
                                <div>
                                  <h2>Video</h2>
                                  <video className="video-container" controls>
                                    <source src={instagramVideo} />
                                  </video>
                                </div>
                                <div>
                                  <h2>Audio</h2>
                                  <audio controls>
                                    <source src={instagramAudio} />
                                  </audio>
                                </div>
                              </>
                            )}
                            {/* <a href={instagramVideo} download={new Date().toLocaleString() + ".mp4"} rel="noreferrer" target="_blank" style={{color: "white", textDecoration: "none"}}>
                                <button className="btn btn-success">
                                  Download Video
                                </button>
                              </a>
                              <a href={instagramAudio} download={new Date().toLocaleString() + ".mp3"} rel="noreferrer" target="_blank" style={{color: "white", textDecoration: "none"}}>
                                <button className="btn btn-primary">
                                  Download Audio
                                </button>
                              </a> */}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {!validIGLink && igLink !== "" ? (
                          <div className="text-center mt-4">
                            <h2 className="text-warning">
                              The link is not Valid
                            </h2>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            ) : (
              <>
                {/* Youtube Downloader */}
                <div className="d-flex justify-content-center align-items-center flex-column">
                  <div>
                    <button
                      className="btn btn-danger mb-4"
                      onClick={backToHomeYT}
                    >
                      Go Back to Home
                    </button>
                  </div>
                  <div className="ig-input">
                    <input
                      type="text"
                      className="form-control"
                      value={ytLink}
                      onChange={(e) => inputYTLinkHandler(e.target.value)}
                      placeholder="paste youtube link here..."
                    />
                  </div>
                  {isLoading ? (
                    <>
                      <div className="d-flex justify-content-center mt-4">
                        <Spinner animation="border" size="lg" />
                      </div>
                    </>
                  ) : (
                    <>
                      {validYTLink ? (
                        <>
                          <div className="d-flex justify-content-center mt-4">
                            <div className="d-flex justify-content-center flex-wrap gap-4">
                              {youtubeVideo === null ? (
                                <>
                                  <div
                                    className="alert alert-danger"
                                    role="alert"
                                  >
                                    Failed to get youtube video
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>
                                    <h2>Video</h2>
                                    {CheckLink(youtubeVideo) ? (
                                      <video
                                        className="video-container"
                                        controls
                                      >
                                        <source src={youtubeVideo} />
                                      </video>
                                    ) : (
                                      <>
                                        <p>
                                          Video Link is not accessible, this
                                          usually because the youtube link is
                                          contains some content that from google
                                          and youtube restrict access to the
                                          content due to the copyright or
                                          something else.
                                        </p>
                                      </>
                                    )}
                                  </div>
                                  <div>
                                    <h2>Audio</h2>
                                    {CheckLink(youtubeAudio) ? (
                                      <audio controls>
                                        <source src={youtubeAudio} />
                                      </audio>
                                    ) : (
                                      <>
                                        <p>
                                          Audio Link is not accessible, this
                                          usually because the youtube link is
                                          contains some content that from google
                                          and youtube restrict access to the
                                          content due to the copyright or
                                          something else.
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </>
                              )}
                              {/* <a href={instagramVideo} download={new Date().toLocaleString() + ".mp4"} rel="noreferrer" target="_blank" style={{color: "white", textDecoration: "none"}}>
                                <button className="btn btn-success">
                                  Download Video
                                </button>
                              </a>
                              <a href={instagramAudio} download={new Date().toLocaleString() + ".mp3"} rel="noreferrer" target="_blank" style={{color: "white", textDecoration: "none"}}>
                                <button className="btn btn-primary">
                                  Download Audio
                                </button>
                              </a> */}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {!validYTLink && ytLink !== "" ? (
                            <div className="text-center mt-4">
                              <h2 className="text-warning">
                                The link is not Valid
                              </h2>
                            </div>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="card-item" onClick={instagramClick}>
              <div className="picture">
                <Image src={instagram} width={200} />
              </div>
              <h2>Instagram Downloader</h2>
            </div>

            <div className="card-item" onClick={youtubeClick}>
              <div className="picture">
                <Image src={youtube} width={200} />
              </div>
              <h2>Youtube Downloader</h2>
              <p>BETA stage development</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
