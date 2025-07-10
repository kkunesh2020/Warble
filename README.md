# Welcome to Warble!

Warble is my website that that visualizes soundscapes and birdcalls. Every time you click the die, you are taken to a random soundscape recording somewhere in the United States. The screen changes to an image of the typical biome in that location, and shows you each of the different birds heard in the soundscape, and where/when the recording was taken. The goal of this application is for people to passively learn more about different bird species and calls while giving them a positive and soothing ambient experience.

If you want to clone this project for yourself, you will have to generate your own API keys for Xeno Canto and Nuthatch API
* https://xeno-canto.org/explore/api
* https://nuthatch.lastelm.software/

This project contains:
* `server.js`: a server that gets data from Xeno Canto (for recordings), Nuthatch (for images), and Wikimedia (for backup images), along with pulling from some of my staic data
* `index.html`: the view for the landing page
* `style.css`: styles for the landing page
* `script.js`: simple script that controls the landing page
* `soundscapes.html`: the view for the soundscapes page, where most of the funcitonality is
* `soundscapes.css`: styles for the soundscapes page
* `loading.css`: styles for the loading overlay
* `soundscapes.js`: main script that controls the flow of the soundscapes page
* `recording.js`: script that loads in a new soundscape with recording audio and other data
* `bird.js`: script that loads the name and image for a given bird species, and creates a card for it to go on the screen
* `loadingManager.js`: script that sets up the loading screen overlay in between soundscapes
* `carousel.js`: script that controls the carousel used to display the different birds on the soundscapes page
* `animations.js`: script that sets up all the animations used with GSAP for the application
* `getData.js`: fetches data from the server
* `biome_images.json`: json file that maps the background images to biome names, so the urls are all in the same place
* `recordings_with_biomes.json`: json file that contains over 200 recording objects from Xeno Canto of soundscapes recorded in the U.S. A python script was used to map biome information from a separate geoJSON file to all of the recording objects based on latitude and longitude
* `.env`: stores the keys used for the APIs

Claude was used occasionally to help with this project in the following areas:

* To optimize my "/wikimedia" endpoint in server.js (which is why it is so long and convoluted, but it works i guess)
* To help build the structure and styling of my carousel in carousel.js and carousel.css, because I was having trouble with the computations and structure
* To build my loading manager in loadingManager.js


