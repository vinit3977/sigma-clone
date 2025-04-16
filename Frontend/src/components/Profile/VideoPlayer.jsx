import React from 'react';
import './VideoPlayer.css';

function VideoPlayer({ videoUrl, onClose }) {
    // Extract video ID from YouTube URL
    const getVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getVideoId(videoUrl);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div className="video-player-overlay">
            <div className="video-player-container">
                <button className="close-button" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
                <div className="video-wrapper">
                    <iframe
                        src={embedUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer; 