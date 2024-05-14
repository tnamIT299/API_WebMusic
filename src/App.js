import "./App.css";
import { useContext, useEffect, useState } from "react";
import Card from "./components/Card";
import { initializePlaylist } from "./initialize";
import Navbar from "./components/Navbar";
import { MusicContext } from "./Context";
import axios from 'axios'
import { useNavigate } from "react-router-dom"
function App() {
  const navigate = useNavigate();
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

  const [user, setUser] = useState({});  
  const getUser = async () => {
    try {
      const response = await axios.get('/api/user', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
      setUser(response.data);
      localStorage.setItem('user', response.data.id);
      localStorage.setItem('name', response.data.name);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
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
      localStorage.setItem('tracks', JSON.stringify(jsonData.tracks.items));
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


  useEffect(() => {
    const storedTracks = localStorage.getItem('tracks');
    if (storedTracks) {
      setTracks(JSON.parse(storedTracks));
    }
  }, [isLoading]);


  useEffect(() => {
    initializePlaylist();
    const fetchToken = async () => {
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials&client_id=a77073181b7d48eb90003e3bb94ff88a&client_secret=68790982a0554d1a83427e061e371507",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const jsonData = await response.json();
        setToken(jsonData.access_token);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchToken();
    setLikedMusic(JSON.parse(localStorage.getItem("likedMusic")));
    setpinnedMusic(JSON.parse(localStorage.getItem("pinnedMusic")));
  }, [setIsLoading, setLikedMusic, setpinnedMusic]);

  return (
    <>
      <Navbar
        tracks={tracks}
        setTracks={setTracks}
        keyword={keyword}
        setKeyword={setKeyword}
        handleKeyPress={handleKeyPress}
        fetchMusicData={fetchMusicData}
      />

      <div className="container" >
        <div className={`row ${isLoading ? "" : "d-none"}`}>
          <div className="col-12 py-5 text-center">
            <div
              className="spinner-border"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>

        

      <div className="row">
        {tracks.map((element) => {
          return <Card key={element.id} element={element} />;
        })}
      </div>

      <div className="row" hidden={tracks.length === 0}>
        <div className="col">
          <button
            onClick={() => {
              setResultOffset((previous) => previous - 20);
              fetchMusicData();
            }}
            className="btn btn-outline-success w-100"
            disabled={resultOffset === 0}
          >
            Previous Next Page: {resultOffset / 20}
          </button>
        </div>
        <div className="col">
          <button
            onClick={() => {
              setResultOffset((previous) => previous + 20);
              fetchMusicData();
            }}
            className="btn btn-outline-success w-100"
          >
            Next Page: {resultOffset / 20 + 2}
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h4 className="text-center text-danger py-2">{message}</h4>
        </div>
      </div>

      <div className="row">
        <div className="col-12 py-5 text-center">
          <h1>
            <i className="bi bi-music-note-list mx-3"></i>
            Chill and Relax
          </h1>
          <h3 className="py-5">Discover music in 30 seconds</h3>
        </div>
      </div>
    </div >
    </>
  );
}

export default App;