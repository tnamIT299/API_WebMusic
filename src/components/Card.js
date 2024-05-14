import React, { useContext, useEffect, useRef,useState } from "react";
import { MusicContext } from "../Context";
import { Link } from "react-router-dom";

function Card({ element }) {
  const musicContext = useContext(MusicContext);
  const setlikedMusic = musicContext.setLikedMusic;
  const setpinnedMusic = musicContext.setPinnedMusic;
  const user = localStorage.getItem("user");
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
    setpinnedMusic(updatePinnedMusic);
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
    return JSON.parse(likedMusicJSON);
}

const getPinnedMusic = () => {
  const pinnedMusicJSON = localStorage.getItem(`pinnedMusic_${user}`);
  if (pinnedMusicJSON === null) {
      return []; 
  }
  return JSON.parse(pinnedMusicJSON);}



  return (
    <div key={element.id} className="col-lg-3 col-md-6 py-2">
      <div className="card">
      <Link style={{textDecoration:'none'}} to= "/detail" state={{element:element}}>
        <div className="ratio ratio-1x1 bg-secondary bg-opacity-25">
          <img
            src={element.album.images[0].url}
            className="card-img-top"
            alt="..."
          />
        </div>
      </Link>
        <div className="card-body">
          <h5 className="card-title d-flex justify-content-between">
            {element.name}
            <div className="add-options d-flex align-items-start">
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

            </div>
          </h5>
          <p className="card-text">Artist: {element.album.artists[0].name}</p>
          <p className="card-text" >
            Release date: {element.album.release_date}
          </p>

        </div>
      </div>
      
    </div>
  );
}

export default Card;