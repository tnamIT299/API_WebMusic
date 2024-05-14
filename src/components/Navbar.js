import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MusicContext } from "../Context";
import { ReactComponent as Sun } from "../Sun.svg";
import { ReactComponent as Moon } from "../Moon.svg";
import PinnedMusic from "./PinnedMusic";
import LikedMusic from "./LikedMusic";
import "./DarkMode.css";
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom"


const Navbar = ({ keyword, handleKeyPress, setKeyword, fetchMusicData, tracks, setTracks }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({});
  const musicContext = useContext(MusicContext);
  const setResultOffset = musicContext && musicContext.setResultOffset;

  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    localStorage.setItem("selectedTheme", "dark");
  }


  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
    localStorage.setItem("selectedTheme", "light");
  }


  const selectedTheme = localStorage.getItem("selectedTheme");
  if (selectedTheme === "dark") {
    setDarkMode();
  }

  const toggleTheme = (event) => {
    if (event.target.checked) setDarkMode();
    else setLightMode();
  };
  const logoutAction = () => {
    axios.post('/api/logout', {}, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      .then((r) => {
        localStorage.setItem('token', "");
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSortChange = (event) => {
    const selectedOption = event.target.value;
    if (selectedOption === 'az') {
      const sortedData = [...tracks].sort((a, b) => (a.album.name).localeCompare(b.album.name, 'vi'));
      setTracks(sortedData);
    } else if (selectedOption === 'za') {
      const sortedData = [...tracks].sort((a, b) => (b.album.name).localeCompare(a.album.name, 'vi'));
      setTracks(sortedData);
    } else if (selectedOption === 'newest') {
      const sortedData = [...tracks].sort((a, b) => {
        return new Date(b.album.release_date) - new Date(a.album.release_date);
      });
      setTracks(sortedData);
    }
  };

  useEffect(() => {

    const getUser = async () => {
      try {
        const response = await axios.get('/api/user', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (localStorage.getItem('token') === "" || localStorage.getItem('token') === null) {
      navigate("/");
    } else {
      getUser();
    }
  }, [navigate]);
  const userpinnedMusic = JSON.parse(localStorage.getItem(`pinnedMusic_${user.id}`));
  const userlikedMusic = JSON.parse(localStorage.getItem(`likedMusic_${user.id}`));
  return (

    <>
      <nav className="navbar navbar-dark navbar-expand-lg bg-dark sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-music-note-list mx-3"></i> Chill and Relax
          </Link>

          <div>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              className="btn btn-secondary btn-sm mx-1"
            >
              <i className="bi bi-pin-angle-fill"></i> {userpinnedMusic ? userpinnedMusic.length : 0}
            </button>

            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#likedMusicModal"
              className="btn btn-secondary btn-sm mx-1"
            >
              <i className="bi bi-heart-fill"></i> {userlikedMusic ? userlikedMusic.length : 0}
            </button>
          </div>

          <div
            className="collapse navbar-collapse d-flex justify-content-center"
            id="navbarSupportedContent"
          >
            {location.pathname === '/detail' ? (
               <input
               className="form-control me-2 w-75"
               type="search"
               style={{
               backgroundColor:"transparent",
               borderColor:"transparent",
               }}
             />
            ) : (
              <>
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  onKeyDown={handleKeyPress}
                  className="form-control me-2 w-75"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />

                <button
                  onClick={() => {
                    setResultOffset(0);
                    fetchMusicData();
                  }}
                  className="btn btn-outline-success">
                  Search
                </button>
              </>
            )}


            <div className='dark_mode'>
              <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onChange={toggleTheme}
                defaultChecked={selectedTheme === "dark"}
              />
              <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <Sun />
                <Moon />
              </label>

            </div>

            {location.pathname !== '/detail' && (
              <select
                style={{
                  padding: '5px',
                  marginLeft: 30,
                  marginRight: 30,
                  width: 200,
                  backgroundColor: 'lightblue',
                  borderRadius: 10,
                }}
                onChange={handleSortChange}
                className="custom-select">
                <option value="">Filter</option>
                <option value="newest">Mới phát hành</option>
                <option value="az">Sắp xếp theo tên A-Z</option>
                <option value="za">Sắp xếp theo tên Z-A</option>
              </select>
            )}

            <div style={{
              display: 'flex',
              width: 150,
              marginLeft: 20,
              color: 'white',
            }}><i className="bi bi-person-circle"></i>{user.name}</div>

            <div className="d-flex">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <button onClick={() => logoutAction()} className="nav-link" aria-current="page">Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div
        className="modal fade modal-xl"
        id="exampleModal"
        tabIndex={1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Pinned Music
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <PinnedMusic />
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade modal-xl"
        id="likedMusicModal"
        tabIndex={1}
        aria-labelledby="likedMusicModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="likedMusicModalLabel">
                Liked Music
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <LikedMusic />
            </div>
          </div>
        </div>

      </div>


    </>
  );
};

export default Navbar;
