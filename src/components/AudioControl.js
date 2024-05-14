import React, { useContext, useEffect, useRef, useState } from "react";
import { MusicContext } from "../Context";
import moment from 'moment';
import './AudioControl.css';
function AudioControl(props) {
  const musicContext = useContext(MusicContext);
  const setlikedMusic = musicContext.setLikedMusic;
  const setpinnedMusic = musicContext.setPinnedMusic;
  const user = localStorage.getItem("user");
  
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const { element } = props;
 

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleForward = () => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const newTime = Math.min(audioRef.current.duration, currentTime + 3);
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleRewind = () => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const newTime = Math.min(audioRef.current.duration, currentTime - 3);
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const volumeLevel = parseFloat(e.target.value);
    if (volumeLevel === 0.0) {
      setIsMute(true);
    } else {
      setIsMute(false);
      setVolume(volumeLevel);
      audioRef.current.volume = volumeLevel;
    }

  };

  useEffect(() => {
    const handleEnded = () => {
      if (isReplaying) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [isReplaying]);

  const handleReplay = () => {
    setIsReplaying(!isReplaying);
  };


  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = audioRef.current.src;
    a.download = 'audio.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  
  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handlePin = () => {
    let pinnedMusic = localStorage.getItem(`pinnedMusic_${user}`);
    pinnedMusic = JSON.parse(pinnedMusic) || [];
    const isPin = pinnedMusic.some((item) => item.id === element.id);
    let updatePinnedMusic = [];
    if (isPin) {
        updatePinnedMusic = pinnedMusic.filter((item) => item.id !== element.id);
    } else {
        updatePinnedMusic = [...pinnedMusic, element];
    }
    setlikedMusic(updatePinnedMusic);
    localStorage.setItem(`pinnedMusic_${user}`, JSON.stringify(updatePinnedMusic));
};


  const handleLike = () => {
    let likedMusic = localStorage.getItem(`likedMusic_${user}`);
    likedMusic = JSON.parse(likedMusic) || [];
    const isLiked = likedMusic.some((item) => item.id === element.id);
    let updatedLikedMusic = [];
    if (isLiked) {
        updatedLikedMusic = likedMusic.filter((item) => item.id !== element.id);
    } else {
        updatedLikedMusic = [...likedMusic, element];
    }
    setlikedMusic(updatedLikedMusic);
    localStorage.setItem(`likedMusic_${user}`, JSON.stringify(updatedLikedMusic));
};


useEffect(() => {
  const localLikedMusic = JSON.parse(localStorage.getItem(`likedMusic_${user}`));
  setlikedMusic(localLikedMusic);
}, [setlikedMusic]);


  useEffect(() => {
    const localPinnedMusic = JSON.parse(localStorage.getItem(`pinnedMusic_${user}`));
    setpinnedMusic(localPinnedMusic);
  }, [setpinnedMusic]);

  const getLikedMusic = () => {
    const likedMusicJSON = localStorage.getItem(`likedMusic_${user}`);
    if (likedMusicJSON === null) {
        return [];
    }
    return JSON.parse(likedMusicJSON);}
    const getPinnedMusic = () => {
      const pinnedMusicJSON = localStorage.getItem(`pinnedMusic_${user}`);
      if (pinnedMusicJSON === null) {
          return [];
      }
      return JSON.parse(pinnedMusicJSON);}

  return (
    <>
      <div className='song-player-container'>

        <div style={{
          position: 'absolute',
          marginBottom: "5%",
          marginTop: "2%",
          marginLeft: "5%"
        }}>

          {getPinnedMusic().some((item) => item.id === element.id) ? (
            <button
              onClick={handlePin}
              className="btn btn-outline-dark mx-1"
            >
              <i className="bi bi-pin-angle-fill"></i>
            </button>
          ) : (
            <button
              onClick={handlePin}
              className="btn btn-outline-dark mx-1"
            >
              <i className="bi bi-pin-angle"></i>
            </button>
          )}

          {getLikedMusic().some((item) => item.id === element.id) ? (
            <button onClick={handleLike} className="btn btn-outline-dark">
              <i className="bi bi-heart-fill text-danger"></i>
            </button>
          ) : (
            <button onClick={handleLike} className="btn btn-outline-dark">
              <i className="bi bi-heart"></i>
            </button>
          )}

          <button
          style={{
            marginLeft:60,
            width:150,
            borderColor:'black',
            
            color:'black'
          }}
            onClick={handleDownload}
            className="btn btn-outline-success">
            Download
            <i style={{
              marginLeft: 10,
              marginRight: 10
            }} className="bi bi-download"></i>
          </button>
        </div>

        <div style={{
          margin: 20,
        }}></div>
        <div style={{
          textAlign: 'center',
        }}>
        </div>

        <div className='song-controls'>
          <div className='play-btn'>

            <img
              onClick={handleRewind}
              style={{
                width: 33,
                height: 33,
                marginRight: 60
              }}
              src={require('../images/rewind-button.png')}>
            </img>

            <img
              style={{
                width: 30,
                height: 30,
              }}
              onClick={handlePlayPause}
              src={isPlaying ? require('../images/pause.png') : require('../images/play.png')}>
            </img>


            <img
              onClick={handleForward}
              style={{
                width: 35,
                height: 35,
                marginLeft: 57
              }}
              src={require('../images/fast-forward.png')}>
            </img>


          </div>
        </div>

        <audio
          ref={audioRef}
          src={element.preview_url}
          className="w-100"
          onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        ></audio>

        <div className='song-progress-container'>
          <p className='timer-start'>{moment().minutes(0).second(currentTime).format('m:ss')}</p>
          <div className='song-progress'>
            <input className='song-progress'
              style={{
                width: "100%",
              }}
              type="range"
              min="0"
              max={audioRef.current && !isNaN(audioRef.current.duration) ? audioRef.current.duration : ""}
              step="0.01"
              value={currentTime}
              onChange={handleTimeChange}
            />
          </div>
          <p className='timer-end'>{moment().minutes(0).second(audioRef.current ? audioRef.current.duration : 0).format('m:ss')}</p>
          

          <img
          onClick={handleReplay}
              style={{
                width: 33,
                height: 33,
                position: "absolute",
                marginLeft:"50%",
              }}
              src={isReplaying  ? require('../images/replayed.png') : require('../images/replay.png')}>
            </img>
          
        </div>
        

        <div
          style={{
            marginLeft: "85%",
            position: 'absolute',
            top: "95%"
          }}>
          <img style={{
            width: 30,
            height: 30,
            marginRight: 10,
          }}
            src={isMute ? require('../images/mute.png') : require('../images/loudspeaker.png')} />
          <input className="volume"
            type="range"
            min="0"
            max="1"
            step="0.01" 
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </>

  )
}
export default AudioControl;