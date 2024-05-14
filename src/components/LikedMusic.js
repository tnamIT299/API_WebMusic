import React, { useContext,useEffect } from "react";
import Card from "./Card";
import { MusicContext } from "../Context";
function LikedMusic() {
  const musicContext = useContext(MusicContext);
  const setLikedMusic = musicContext.setLikedMusic;
  const user = localStorage.getItem("user");
  useEffect(() => {
    window.scrollTo(0, 0);
    const localLikedMusic = JSON.parse(localStorage.getItem(`likedMusic_${user}`));
    if (localLikedMusic) {
      setLikedMusic(localLikedMusic);
    }
  }, [setLikedMusic]);
  const getLikedMusic = () => {
    const likedMusicJSON = localStorage.getItem(`likedMusic_${user}`);
    if (likedMusicJSON === null) {
        return [];
    }
    return JSON.parse(likedMusicJSON);
}
  return (
    <div className="container">
      <div className="row">
        {getLikedMusic().length === 0 ? (
          <div className="col">
            <h3 className="py-5 text-center">
              You don't have any liked music yet!
            </h3>
            <div className="text-center">
              <i className="bi bi-emoji-frown fs-1"></i>{" "}
            </div>
          </div>
        ) : (
          getLikedMusic().map(({ id, ...rest }) => (
            <Card key={id} element={{ id, ...rest }} />
          ))
        )}
      </div>
    </div>
  );
}

export default LikedMusic;
