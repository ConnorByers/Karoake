import React from 'react'
import AudioPlayer from 'react-h5-audio-player';

export default function ResultPage({ combinedUrl }) {
    return (
        <div>
            <p className="instructions">
                Here's your karoake song with your voice over the production!
            </p>
            <div className="buttonwrapper">
            <a
                download
                href={combinedUrl}
                className="uploadbutton"
                target="_blank"
                rel="noopener"
            >
                Download The Song
            </a>
            </div>
            <div className="line"></div>
            <div className="audioplayercontainer">
                <AudioPlayer
                src={combinedUrl}
                showJumpControls={false}
                layout="horizontal-reverse"
                customVolumeControls={[]}
                customAdditionalControls={[]}
                />
            </div>
        </div>
    )
}
