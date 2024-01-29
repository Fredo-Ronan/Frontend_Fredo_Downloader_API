import React, { useEffect, useState } from "react";

async function CheckLink(link) {
  try {
    const response = await fetch(link, { method: "HEAD" });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking video link:", error);
    return false;
  }
}

function VideoAudioShow({ videoLink, audioLink, accessibility = true }) {
  const [isLinkAccessible, setIsLinkAccessible] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const linkAccessible = await CheckLink(videoLink);
      const linkAudioAccessible = await CheckLink(audioLink);
      setIsLinkAccessible(linkAccessible);

      if (accessibility) {
        setIsLinkAccessible(true);
      }
    }

    fetchData();
  }, [videoLink, audioLink]);

  return (
    <>
      {isLinkAccessible ? (
        <>
          <div>
            <h2>Video</h2>
            <video className="video-container" controls>
              <source src={videoLink} />
            </video>
          </div>
          <div>
            <h2>Audio</h2>
            <audio controls>
              <source src={audioLink} />
            </audio>
          </div>
        </>
      ) : (
        <p>
          Video and Audio Link is not accessible; this usually happens because
          the YouTube link contains content that Google and YouTube restrict
          access to due to copyright or other reasons.
        </p>
      )}
    </>
  );
}

export default VideoAudioShow;
