import fs from "fs";
import axios from "axios";

const rawData = fs.readFileSync("champions-basic-data.json");
const championsBasicData = JSON.parse(rawData);

const baseUrl =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/";

async function downloadImage(url, image_path) {
  return axios({
    url,
    responseType: "stream",
  }).then(
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on("finish", () => resolve())
          .on("error", (e) => reject(e));
      })
  );
}

async function getImages() {
  const images = championsBasicData.map(async (j) => {
    const url = `${baseUrl}${j.id}.png`;
    const path = `./images/${j.name}.png`;
    return await downloadImage(url, path);
  });
  await Promise.all(images);
}

getImages();
