export const initializePlaylist = () => {
  let allPlaylist = localStorage.getItem("allPlaylist");
  if (!allPlaylist) {
    localStorage.setItem("allPlaylist", "{}");
  }
};
