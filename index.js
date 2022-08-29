const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

const TorrentSearchApi = require("torrent-search-api");

// TorrentSearchApi.enablePublicProviders()

// Search '1080' in 'Movies' category and limit to 20 results

// const torrentHtmlDetail = await TorrentSearchApi.getTorrentDetails(torrents[0])
// const magnet = await TorrentSearchApi.getMagnet(torrents[0]);
// const buffer = await TorrentSearchApi.downloadTorrent(torrents[0], 'loki');

app.post("/search", (req, res) => {
  const { Title, Date } = req.body;

  TorrentSearchApi.enableProvider("ThePirateBay");

  async function search() {
    const torrents = await TorrentSearchApi.search(
      `${Title} ${Date}`,
      "All",
      5
    );

    const titles = torrents.map((item) => {
      return item.magnet;
    });
    const unique = new Set(titles.sort());
    res.json({ results: [...unique] });
  }

  search();
});

// app.post("/tv", (req, res) => {
//   const { Title } = req.body;
//   console.log(Title);

//   // let title = Title.replace("Vikings: Valhalla", "Vikings")
//   // title = Title.replace("Peacemaker", "Peacemaker 2022")

//   console.log(Title);

//   TorrentSearchApi.enableProvider("Eztv");

//   async function search() {
//     const torrents = await TorrentSearchApi.search(`${Title}`, "All");
//     const links = [];
//     const titles = torrents.map((item) => {
//       let regex = new RegExp(`^\\${Title} s\\d`, "gi");
//       if (regex.test(item.title)) {
//         links.push({
//           episode: item.title.substring(item.length + 1, Title.length + 7),
//           magnet: item.magnet,
//         });
//       }

//       return links;
//     });

//     const key = "episode";

//     const arrayUniqueByKey = [
//       ...new Map(titles.flat().map((item) => [item[key], item])).values(),
//     ].sort(function (a, b) {
//       var alc = a.episode.toLowerCase(),
//         blc = b.episode.toLowerCase();
//       return alc < blc
//         ? 1
//         : alc > blc
//         ? -1
//         : a.episode < b.episode
//         ? 1
//         : a.episode > b.episode
//         ? -1
//         : 0;
//     });

//     console.log(arrayUniqueByKey);
//     res.json({ results: [...arrayUniqueByKey] });

//     // const unique = [...new Set(titles.sort())]
//     // console.log(unique)
//     // res.json(unique)
//   }

//   search();
// });

app.get("/", (req, res) => {
  res.send("Welcome");
});
app.listen(port);
