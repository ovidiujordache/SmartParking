import React from 'react';
import YouTubePlayer from './YouTubePlayer';
import Navbar from './Navbar';

export default function Live() {
    const normalVideoId = '6LQ8mvxLPMI';
    
    return <>
    <div className='livePage'>
        <Navbar />
        <div className='centeredPlayer'>
            <YouTubePlayer videoId={normalVideoId} />
        </div>
    </div>
    </>
}
