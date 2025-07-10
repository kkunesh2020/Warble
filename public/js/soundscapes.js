// script for soundscapes.html
import getData from "./getData.js";
import loadBirdData from "./bird.js";
import loadSoundscape from "./recording.js";
import { initCarousel, resetCarousel } from "./carousel.js";
import { setupAnimations, playPageLoadAnimations, pauseAnimations } from "./animations.js";
import loadingManager from "./loadingManager.js";

// check if audio can play
function checkAudioReady() {
  return new Promise((resolve) => {
    const audio = document.getElementById("soundscape-audio");
    
    if (!audio) {
      console.warn("Audio element not found, proceeding anyway");
      resolve(true);
      return;
    }
    
    // If audio is already ready
    if (audio.readyState >= 3) {
      resolve(true);
      return;
    }
    
    // timeout if audio takes too long
    const timeoutId = setTimeout(() => {
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("canplaythrough", onCanPlay);
      console.warn("Audio loading timed out, proceeding anyway");
      resolve(true);
    }, 20000);
    
    const onCanPlay = () => {
      clearTimeout(timeoutId);
      
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("canplaythrough", onCanPlay);
      resolve(true);
    };
    
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("canplaythrough", onCanPlay);
  });
}

// Load soundscape
async function loadSoundscapeAndBirds(soundscapeArray) {
  const currSoundscape = await loadSoundscape(soundscapeArray);
  
  // wait for all bird data to load
  const birdLoadPromises = currSoundscape.also.map(species => loadBirdData(species));
  await Promise.all(birdLoadPromises);
  
  return currSoundscape;
}

async function handleLoadingProcess(soundscapeArray, shouldReset = false) {
  try {
    if (shouldReset) {
      pauseAnimations();
      const imageDisplay = document.querySelector("#image-box");
      imageDisplay.innerHTML = "";
      resetCarousel();
      setupAnimations();
    }
    
    loadingManager.showLoading();
    
    // load data
    await loadSoundscapeAndBirds(soundscapeArray);
    
    // wait for audio
    await checkAudioReady();
    loadingManager.hideLoading();
    playPageLoadAnimations();
    
  } catch (error) {
    console.error("Error loading soundscape data:", error);
    setTimeout(() => {
      loadingManager.hideLoading();
    }, 2000);
  }
}

async function mainThread() {
  loadingManager.init();
  initCarousel();
  setupAnimations();
  
  const soundscapeArray = await getData("/soundscape", "");
  
  const buttonLoadData = document.querySelector("#loadData");
  buttonLoadData.addEventListener("click", async (evt) => {
    evt.preventDefault();
    await handleLoadingProcess(soundscapeArray, true);
  });
  
  await handleLoadingProcess(soundscapeArray, false);
}

document.addEventListener("DOMContentLoaded", async () => mainThread());