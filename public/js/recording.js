// loads in a new soundscape with recording audio and other data
import getData from "./getData.js";
import loadBirdData from "./bird.js";

const soundscapeURL = "/soundscape";
const imagePlaceholder = "https://cdn.glitch.global/e3f6f947-461f-49a3-b110-007b2390571c/bird-placeholder-image.png?v=1745102459099";

const imageDisplay = document.querySelector("#image-box");
const container = document.querySelector(".container");
const locationInfo = document.querySelector("#location-info");
const uploadData = document.querySelector("#upload-data");
const linkBox = document.querySelector("#links");
const remark = document.querySelector("#remark");
const audioBox = document.querySelector("#soundscape-audio-box");

//load a new soundscape
export default async function loadSoundscape(soundscapeArray) {
  const recordings = soundscapeArray.recordings;

  let currSoundscape = recordings[getRandomIntInclusive(0, recordings.length - 1)];

  locationInfo.replaceChildren();

  // Start playing audio immediately
  controlAudio(currSoundscape.file);

  let loc = document.createElement("h4");
  loc.appendChild(document.createTextNode(currSoundscape.loc));

  let nameDate = document.createElement("p");
  nameDate.appendChild(document.createTextNode(`${currSoundscape.rec}, ${convertDate(currSoundscape.date)}, ${convertTime(currSoundscape.time)}`));

  let eco = document.createElement("p");
  eco.appendChild(document.createTextNode(currSoundscape.eco_name));


  remark.replaceChildren(document.createTextNode(currSoundscape.rmk));

  if (currSoundscape.rmk === "") {
    remark.style.display = "none";
  } else {
    remark.style.display = "flex";
  }

  locationInfo.appendChild(loc);
  locationInfo.appendChild(eco);

  const number = document.createElement("a");
  number.textContent = `Catalogue number ${currSoundscape.id} from Xeno Canto, `;
  number.href = currSoundscape.url;
  number.target = "_blank";

  const license = document.createElement("a");
  license.textContent = "go here for license information";
  license.href = currSoundscape.lic;
  license.target = "_blank";


  uploadData.replaceChildren(nameDate);
  linkBox.replaceChildren(number, license);

  await getBiomeImage(currSoundscape);

  return currSoundscape;
}

// gets the right background image for recording's location
const getBiomeImage = async (currSoundscape) => {
  const biomeImage = await getData("/biomeImage", currSoundscape.biome_name);

  if (biomeImage.image == "") {
    container.style.backgroundImage = `url(${imagePlaceholder})`;
  } else {
    container.style.backgroundImage = `url(${biomeImage.image})`;
    container.style.backgroundSize = "cover";
  }
};

// stops previous audio when new soundscape is loaded
const stopAllAudio = () => {
  document.querySelectorAll("audio").forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.src = "";
  });
};

// fades in the audio so it doesn't sound too harsh
const fadeAudio = (audio) => {
  audio.volume = 0.0;

  const fadeInterval = setInterval(() => {
    if (audio.volume < 0.99) {
      audio.volume += 0.01;
    } else {
      audio.volume = 1.0;
      clearInterval(fadeInterval);
    }
  }, 100);
};

// sets up audio for the soundscape recording
const controlAudio = (audioFile) => {
  stopAllAudio();

  const audio = document.createElement("audio");
  audio.id = "soundscape-audio";
  audio.src = audioFile;
  audio.controls = true;
  audio.autoplay = true;
  audio.loop = true;

  audio.addEventListener("play", (event) => {
    fadeAudio(audio);
  });

  audioBox.replaceChildren(audio);
};

//Get a random integer
const getRandomIntInclusive = (min, max) => {
  const min2 = Math.ceil(min);
  const max2 = Math.floor(max);
  return Math.floor(Math.random() * (max2 - min2 + 1) + min2);
};

//convert yyy-mm-dd to month day, year
const convertDate = (date) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const components = date.split("-");
  let monthIndex = parseInt(components[1]) - 1;

  return `${months[monthIndex]} ${components[2]}, ${components[0]}`
}

//convert 24hr time to 12hr time
const convertTime = (time) => {
  const components = time.split(":");

  let hour = parseInt(components[0]);
  let timeOfDay = "am";

  if (hour > 12) {
    hour = (hour % 12);
    timeOfDay = "pm";
  }

  return `${hour}:${components[1]} ${timeOfDay}`

}