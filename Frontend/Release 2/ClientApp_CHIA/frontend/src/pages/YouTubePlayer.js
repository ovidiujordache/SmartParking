import React, { useEffect } from 'react';


const YouTubePlayer = ({ videoId }) => {
  useEffect(() => {
    // Load YouTube iframe API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Create a YouTube player
    let player;
    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player('player', {
        height: '720',
        width: '1280',
        videoId: videoId,
        playerVars: {
          // autoplay: 1,
          controls: 1,
          playsinline: 1,
        },
        events: {
          // You can add event listeners here if needed
        },
      });
    };

    // Clean up on unmount
    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [videoId]);

  return <div id="player"></div>;
};

export default YouTubePlayer;
