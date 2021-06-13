import axios from "axios";
import jsdom from "jsdom";
import fs from "fs";

const { JSDOM } = jsdom;

async function getData() {
  // Getting data from this page
  const data = await axios.get(
    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/"
  );

  // Create DOM to access champion ids from the <td> tag
  const dom = new JSDOM(data.data);
  const td = dom.window.document.querySelectorAll("td");
  const jsonUrls = [];
  // Get the ones appended with a .json
  td.forEach((d) => {
    if (d.textContent.endsWith(".json")) {
      jsonUrls.push(d.textContent);
    }
  });
  const baseUrl =
    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/";
  // Query .json file for each champion
  const arrToWrite = jsonUrls.map(async (j) => {
    const url = `${baseUrl}${j}`;
    const data = await axios.get(url);
    return data.data;
  });
  const results = await Promise.all(arrToWrite);

  // Write it to champions-basic-data.json
  fs.writeFileSync("champions-basic-data.json", JSON.stringify(results));
}

getData();
