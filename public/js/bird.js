// loads the name and image for a given bird species, and creates a card for it to go on the screen
import getData from "./getData.js";
import addCardToCarousel from "./carousel.js";

const birdDataURL = "/birdData";
const nuthatchURL = "/birdImage";
const wikimediaURL = "/wikimedia";

const imageDisplay = document.querySelector("#image-box");
const imagePlaceholder = "images/Placeholder.png";
const infoIcon = "images/info-icon.svg";

// gets the data from the api and initializes a card with it
export default async function loadBirdData(species) {
  try {
    const birdData = await getData(birdDataURL, species);
    const recording = birdData.recordings[0];
    const commonName = recording.em;

    const imageUrl = await getBirdImage(species, commonName);

    createBirdCard(species, recording, imageUrl);

  } catch (error) {
    console.error(`Error loading data for ${species}:`, error);
  }
}

// goes through a few different options to try to get the best image for the bird
const getBirdImage = async (species, commonName) => {
  try {
    // Try to get image from Nuthatch API
    const birdImage = await getData(nuthatchURL, species);
    if (birdImage.body.entities[0].images[0]) {
      return birdImage.body.entities[0].images[0];
    }
    // If Nuthatch doesn't work, try Wikimedia
    try {
      const birdImageAlt = await getData(wikimediaURL, species);
      if (birdImageAlt.image) {
        return birdImageAlt.image;
      }
    } catch {
      // Otherwise, use placeholder image
      return imagePlaceholder;
    }
  } catch {
    return imagePlaceholder;
  }
}

// creates a card to be added to the DOM
const createBirdCard = (species, recording, imageUrl) => {
  const card = document.createElement("div");
  card.classList.add("ident");

  const infoContainer = document.createElement("div");
  infoContainer.classList.add("bird-info");

  // Make bird image
  const img = document.createElement("img");
  img.classList.add("bird-image");
  img.src = imageUrl;
  img.alt = recording.en;

  const moreInfo = document.createElement("div");
  moreInfo.classList.add("more-info");

  const infoIconBox = document.createElement("div");
  infoIconBox.classList.add("info-icon");
  infoIconBox.style.backgroundImage = `url(${infoIcon})`;

  const recordingInfo = document.createElement("div");
  recordingInfo.classList.add("recording-info");


  const recordist = document.createElement("p");
  recordist.textContent = `Recording by ${recording.rec}`;

  const number = document.createElement("a");
  number.textContent = `#${recording.id} from Xeno Canto`;
  number.href = recording.url;
  number.target = "_blank";

  const license = document.createElement("a");
  license.textContent = "License information";
  license.href = recording.lic;
  license.target = "_blank";

  recordingInfo.appendChild(recordist);
  recordingInfo.appendChild(number);
  recordingInfo.appendChild(license);

  moreInfo.appendChild(infoIconBox);
  moreInfo.appendChild(recordingInfo);

  const upperInfo = document.createElement("div");
  upperInfo.classList.add("upper-info");

  const names = document.createElement("div");
  names.classList.add("names");

  const commonName = document.createElement("h5");
  commonName.textContent = recording.en;

  const scientificName = document.createElement("p");
  scientificName.textContent = species;

  names.appendChild(commonName);
  names.appendChild(scientificName);

  upperInfo.appendChild(names);
  upperInfo.appendChild(moreInfo);

  // Make audio element with the recording of the bird call
  const audio = document.createElement("audio");
  audio.src = recording.file;
  audio.controls = true;

  // Put all the elements in the card
  card.appendChild(img);
  infoContainer.appendChild(upperInfo);
  infoContainer.appendChild(audio);
  card.appendChild(infoContainer);

  imageDisplay.appendChild(card);

  addCardToCarousel(card);
}