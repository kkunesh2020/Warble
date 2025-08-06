// server.js

import express from "express";
import fetch from "node-fetch";
import path from "path";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import soundscapeData from "./data/recordings_with_biomes.json" assert { type: "json" };
import biomeImages from "./data/biome_images.json" assert { type: "json" };

const app = express();
const __dirname = path.resolve();
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/soundscapes", (request, response) => {
  response.sendFile(__dirname + "/views/soundscapes.html");
});

//get soundscape recordings
app.get("/soundscape", async (req, res) => {
  try {
    res.send({
      recordings: soundscapeData.recordings,
    });
  } catch (error) {
    console.error("Error fetching recordings:", error);
    res.status(500).json({
      error: "Failed to fetch recordings",
      details: error.message,
    });
  }
});

//get biome image
app.get("/biomeImage", async (req, res) => {
  try {

    const biome = req.query.query;

    res.send({
      image: biomeImages[biome],
    });
  } catch (error) {
    console.error("Error fetching biome image:", error);
    res.status(500).json({
      error: "Failed to fetch recordings",
      details: error.message,
    });
  }
});

//get all of the recordings for the given bird species
app.get("/birdData", async (req, res) => {
  try {
    const species = req.query.query;

    if (!species) {
      return res.status(400).json({
        error: "Species parameter is required",
      });
    }

    const response = await fetch(
      `https://xeno-canto.org/api/3/recordings?query=sp:%22${species}%22+q:%22%3EC%22&key=${process.env.xenoCantoKey}`
    );

    const data = await response.json();

    res.send({
      recordings: data.recordings,
    });
  } catch (error) {
    console.error("Error fetching recordings:", error);
    res.status(500).json({
      error: "Failed to fetch recordings",
      details: error.message,
    });
  }
});

//get images of the given bird species from Nuthatch API
app.get("/birdImage", async (req, res) => {
  try {
    const species = req.query.query;

    if (!species) {
      return res.status(400).json({
        error: "Species parameter is required",
      });
    }

    const response = await fetch(
      `https://nuthatch.lastelm.software/v2/birds?page=1&pageSize=25&sciName=${species}&operator=AND`,
      {
        headers: {
          "API-Key": process.env.nuthatchKey,
        },
      }
    );

    const data = await response.json();

    res.send({
      body: data,
    });
  } catch (error) {
    console.error("Error fetching recordings:", error);
    res.status(500).json({
      error: "Failed to fetch recordings",
      details: error.message,
    });
  }
});

// Get images of the given bird species from Wikimedia, try to find the best one
app.get("/wikimedia", async (req, res) => {
  try {
    const species = req.query.query;
    if (!species) {
      return res.status(400).json({ error: "Species parameter is required" });
    }

    // Search for images using Wikimedia API (search for files)
    const searchResponse = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=file:${encodeURIComponent(species)}&gsrlimit=10&prop=imageinfo&format=json&iiprop=url`
    );
    const searchData = await searchResponse.json();

    if (!searchData.query || !searchData.query.pages) {
      return res.status(404).json({ error: "No images found for this species" });
    }

    // Filter out unwanted images (maps, logos, svg, etc.)
    const unwanted = ["map", "logo", "svg", "icon", "iucn", "diagram", "range", "mp3", "mp4"];
    const images = Object.values(searchData.query.pages)
      .filter(img => {
        const title = img.title?.toLowerCase() || "";
        return !unwanted.some(word => title.includes(word));
      })
      .filter(img => img.imageinfo && img.imageinfo[0] && img.imageinfo[0].url);

    if (images.length === 0) {
      return res.status(404).json({ error: "No suitable images found for this species" });
    }

    // Return the first suitable image URL
    return res.json({ image: images[0].imageinfo[0].url});
  } catch (error) {
    console.error("Error in Wikimedia API endpoint:", error);
    res.status(500).json({ error: "Failed to fetch images", details: error.message });
  }
});

// listen for requests
const listener = app.listen(port, '0.0.0.0', function () {
  console.log("Your app is listening on port " + listener.address().port);
});