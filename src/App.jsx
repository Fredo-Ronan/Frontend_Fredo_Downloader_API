import { useState } from "react";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";

import instagram from "./assets/instagram.png";
import youtube from "./assets/youtube.png";

import "./App.css";
import { DownloadInstagram } from "./api/apiFunctions";

function App() {
  const [isChoosen, setIsChoosen] = useState(false);
  const [choose, setChoose] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [igLink, setIgLink] = useState("");
  const [validIGLink, setValidIGLink] = useState(false);
  const [instagramVideo, setInstagramVideo] = useState("");
  const [instagramAudio, setInstagramAudio] = useState("");

  const backToHome = () => {
    setChoose("");
    setIgLink("");
    setValidIGLink(false);
    setInstagramAudio("");
    setInstagramVideo("");
    setIsChoosen(false);
  };

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
              <></>
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
                  <button className="btn btn-danger mb-4" onClick={backToHome}>
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
              <>{/* Youtube Downloader */}</>
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

            <div className="card-item">
              <div className="picture">
                <Image src={youtube} width={200} />
              </div>
              <h2>Youtube Downloader</h2>
              <p>Under Development</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
