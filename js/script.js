const songList = document.querySelector(".songList");
const volume_icon = document.querySelector("#volume_icon");
const playButton = document.querySelector(".play");
const previous = document.querySelector(".left-play");
const next = document.querySelector(".right-play");
const vol = document.querySelector("#volume");
const currentSong = new Audio();
let playlistId = "playlist1";
let currentPlaylist = null; // Store the currently loaded playlist
let currentSongIndex = -1; // Store the index of the currently playing song
let previousVolume = 1;

const playlists = {
  playlist1: [
    {
      songName: "295 by Sidhu Moose Wala",
      songPath: "songs/295 by Sidhu Moose Wala.mp3",
    },
    {
      songName: "Alan Walker - Faded",
      songPath: "songs/Alan Walker - Faded.mp3",
    },
    { songName: "Alone, Pt. II", songPath: "songs/Alone, Pt. II.mp3" },
  ],
  playlist2: [
    {
      songName: "Believer Lil Wayne, Imagine Dragons",
      songPath: "songs/Believer Lil Wayne, Imagine Dragons.mp3",
    },
    {
      songName: "Besabriyaan Armaan_Malik",
      songPath: "songs/Besabriyaan Armaan_Malik.mp3",
    },
    {
      songName: "Bijlee Bijlee - Harrdy Sandhu",
      songPath: "songs/Bijlee Bijlee - Harrdy Sandhu.mp3",
    },
  ],
  playlist3: [
    {
      songName: "Bol Do Na Zara by Armaan Malik",
      songPath: "songs/Bol Do Na Zara by Armaan Malik.mp3",
    },
    {
      songName: "Cartoon - On & On",
      songPath: "songs/Cartoon - On & On.mp3",
    },
    {
      songName: "Charka - Lakhwinder Wadali",
      songPath: "songs/Charka - Lakhwinder Wadali.mp3",
    },
  ],
  playlist4: [
    {
      songName: "Jab Tak by Armaan_Malik",
      songPath: "songs/Jab Tak by Armaan_Malik.mp3",
    },
    {
      songName: "Sanju Kar Har Maidaan Fateh",
      songPath: "songs/Sanju Kar Har Maidaan Fateh.mp3",
    },
    {
      songName: "Tera Hi Bas Hona Chaahoon",
      songPath: "songs/Tera Hi Bas Hona Chaahoon.mp3",
    },
  ],
  // you can add more playlists
};

// convert seconds to minutes:seconds format
function convertToMinuteSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  // Calculate minutes and seconds
  seconds = Math.floor(seconds);

  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;

  // Format minutes and seconds to always have two digits
  minutes = minutes < 10 ? "0" + minutes : minutes;
  remainingSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  // Return the formatted time
  return `${minutes}:${remainingSeconds}`;
}

// updating the button states of next and previous button on the songs buttons
function updateButtonStates() {
  // Disable "Previous" button if on the first song
  document.querySelector(".left-play").disabled = currentSongIndex === 0;

  // Disable "Next" button if on the last song
  document.querySelector(".right-play").disabled =
    currentSongIndex === currentPlaylist.length - 1;
}

// music play function
function playMusic(songName, pause = false) {
  let path = "songs/" + songName + ".mp3";
  currentSong.src = path;
  if (!pause) {
    currentSong.play();
    playButton.src = "svg's/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = songName;
  currentSong.addEventListener("loadedmetadata", function () {
    document.querySelector(".songTime").innerHTML = `${convertToMinuteSeconds(
      currentSong.currentTime
    )} / ${convertToMinuteSeconds(currentSong.duration)}`;
  });

  // Update currentSongIndex based on the song being played
  currentSongIndex = currentPlaylist.findIndex(
    (song) => song.songName === songName
  );

  // Update button states
  updateButtonStates();

  // when songs time over , then if the playlist is over then loop bakc to first song , otherwise switch to the next song
  currentSong.onended = () => {
    if (currentPlaylist && currentSongIndex < currentPlaylist.length - 1) {
      const nextSong = currentPlaylist[currentSongIndex + 1].songName;
      playMusic(nextSong); // Play the next song
    } else {
      console.log("Reached the end of the playlist. Starting over.");
      playMusic(currentPlaylist[0].songName); // Loop back to the first song
    }
  };
}

// Call this function on site load
window.onload = () => {
  loadPlaylist(playlistId); // Load the default playlist
  playMusic(playlists.playlist1[0].songName, true);
  playButton.src = "svg's/play.svg";
};

// Function to load songs from a playlist into the song list
function loadPlaylist(playlistId) {
  currentPlaylist = playlists[`${playlistId}`]; // Update the current playlist
  songList.innerHTML = ""; // Clear the current song list
  currentPlaylist.forEach((song, index) => {
    songList.innerHTML += `<div class="songItem" data-index="${index}" >
                            <span>${song.songName}</span>
                            <img class="play" src="svg's/play.svg" alt="" />
                          </div>`;
  });

  // Add event listeners to the new song items
  Array.from(songList.getElementsByClassName("songItem")).forEach((div) => {
    div.addEventListener("click", (e) => {
      let songName = e.currentTarget.querySelector("span").innerText;
      const songIndex = parseInt(e.currentTarget.getAttribute("data-index"));
      playMusic(songName);
      document.querySelector(".playbar").style.zIndex = 1;
    });
  });
}

// Modify the card click event to load the playlist
Array.from(document.getElementsByClassName("card")).forEach((card) => {
  card.addEventListener("click", (e) => {
    playlistId = e.currentTarget.getAttribute("data-playlist");
    loadPlaylist(playlistId); // Load the selected playlist
    document.querySelector(".playbar").style.zIndex = 1;
  });
});

// playbutton on the middle
playButton.addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    playButton.src = "svg's/pause.svg";
  } else {
    currentSong.pause();
    playButton.src = "svg's/play.svg";
  }
});

// update the time while playing the song
currentSong.addEventListener("timeupdate", () => {
  document.querySelector(".songTime").innerHTML = `${convertToMinuteSeconds(
    currentSong.currentTime
  )} / ${convertToMinuteSeconds(currentSong.duration)}`;

  document.querySelector(".circle").style.left =
    (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

//clickable seekbar
document.querySelector(".seekbar").addEventListener("click", (e) => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentSong.currentTime = (percent * currentSong.duration) / 100;
});

// small screen size ke liye hamburger pe clickable event
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = 0;
  document.querySelector(".hamburger").style.visibility = "hidden";
  document.querySelector(".kanti").style.display = "inline";
  document.querySelector(".playbar").style.zIndex = 0;
});

// handling the responsiveness of the left side bar, using hamburger and kanti icon
document.querySelector(".kanti").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-100%";
  document.querySelector(".hamburger").style.visibility = "visible";
  document.querySelector(".kanti").style.display = "none";
});

// previous button implementation
previous.addEventListener("click", () => {
  currentSong.pause();
  if (currentPlaylist && currentSongIndex > 0) {
    const prevSong = currentPlaylist[currentSongIndex - 1].songName;
    playMusic(prevSong);
  } else {
    currentSong.pause();
    currentSong.currentTime = 0;
    playButton.src = "svg's/play.svg";
    console.log("This is the first song in the playlist.");
  }
});

// next button of music implementation
next.addEventListener("click", () => {
  currentSong.pause();
  if (currentPlaylist && currentSongIndex < currentPlaylist.length - 1) {
    const nextSong = currentPlaylist[currentSongIndex + 1].songName;
    playMusic(nextSong);
  } else {
    currentSong.pause();
    currentSong.currentTime = 0;
    playButton.src = "svg's/play.svg";
    console.log("This is the last song in the playlist.");
  }
});

// volume button scrollbar
vol.addEventListener("input", () => {
  currentSong.volume = vol.value / 100; // Update volume based on slider value
  if (currentSong.volume === 0) {
    volume_icon.src = "svg's/mute.svg"; // Show mute icon when volume is 0
  } else {
    volume_icon.src = "svg's/volume.svg"; // Show volume icon when volume > 0
  }
});

// mute and unmute button implementation
volume_icon.addEventListener("click", () => {
  if (currentSong.volume !== 0) {
    previousVolume = currentSong.volume;
    currentSong.volume = 0;
    volume_icon.src = "svg's/mute.svg";
    vol.value = 0;
  } else {
    currentSong.volume = previousVolume;
    volume_icon.src = "svg's/volume.svg";
    vol.value = previousVolume * 100;
  }
});
