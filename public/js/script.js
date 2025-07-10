// script for index.html (landing page)
import getData from "./getData.js";

async function mainThread() {
  const buttonToSoundscapes = document.querySelector("#to-soundscapes");

  buttonToSoundscapes.addEventListener("click", async (evt) => {
    evt.preventDefault();
    window.location.href = '/soundscapes';
  });
}                        

document.addEventListener("DOMContentLoaded", async () => mainThread());