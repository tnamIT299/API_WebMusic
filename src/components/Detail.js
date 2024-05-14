import React, { useContext, useEffect, useRef, useState } from "react";
import { MusicContext } from "../Context";
import { useLocation } from 'react-router-dom'
import Navbar from "./Navbar";
import AudioControl from "./AudioControl";
function Detail() {

    const [keyword, setKeyword] = useState("");
    const [message, setMessage] = useState("");
    const [tracks, setTracks] = useState([]);
    const [token, setToken] = useState(null);


    const musicContext = useContext(MusicContext);
    const isLoading = musicContext.isLoading;
    const setIsLoading = musicContext.setIsLoading;
    const setLikedMusic = musicContext.setLikedMusic;
    const setpinnedMusic = musicContext.setPinnedMusic;
    const resultOffset = musicContext.resultOffset;
    const setResultOffset = musicContext.setResultOffset;
    const location = useLocation()
    const { element } = location.state

    const fetchMusicData = async () => {
        setTracks([]);
        window.scrollTo(0, 0);
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${keyword}&type=track&offset=${resultOffset}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Not found data ! Please try again");
            }

            const jsonData = await response.json();

            setTracks(jsonData.tracks.items);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            setResultOffset(0);
            fetchMusicData();
        }
    };


    return (
        <div>
            <Navbar
                tracks={tracks}
                setTracks={setTracks}
                keyword={keyword}
                setKeyword={setKeyword}
                handleKeyPress={handleKeyPress}
                fetchMusicData={fetchMusicData}
            />
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                }}>
                <img style={{
                    height: 470,
                    width: 470,
                    justifyContent: 'center',
                    alignContent: 'center',
                }}
                    src={element.album.images[0].url}
                />

                <div style={{
                    textAlign: 'center',
                    justifyContent: 'center',
                    marginTop: 20
                }}>
                    <h3>{element.name}</h3>
                    <p>{element.album.artists[0].name}</p>
                </div>

            </div>
            <AudioControl element={element} />
        </div>

    )
}

export default Detail;