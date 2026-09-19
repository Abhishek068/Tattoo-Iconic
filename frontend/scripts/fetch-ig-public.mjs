import https from "https";

const url = "https://www.instagram.com/tatoo.iconic/?__a=1&__d=dis";

const options = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1"
  }
};

fetch("https://www.instagram.com/tatoo.iconic/", options)
  .then(res => res.text())
  .then(html => {
    console.log("HTML length:", html.length);
    // Search for script tags with JSON
    const matches = html.match(/<script type="application\/json"[^>]*>(.*?)<\/script>/g);
    console.log("Found JSON script tags:", matches ? matches.length : 0);
    if (matches) {
      matches.forEach((m, idx) => {
        if (m.includes("xdt_api__v1__feed__user_timeline_graphql_connection") || m.includes("edge_owner_to_timeline_media") || m.includes("user")) {
          console.log(`Match ${idx} contains timeline data! Length: ${m.length}`);
        }
      });
    }

    // Check for post URLs (e.g. /p/ or /reel/)
    const postUrls = html.match(/\/p\/[A-Za-z0-9_-]+/g) || [];
    const reelUrls = html.match(/\/reel\/[A-Za-z0-9_-]+/g) || [];
    console.log("Found /p/ links:", [...new Set(postUrls)]);
    console.log("Found /reel/ links:", [...new Set(reelUrls)]);
  })
  .catch(err => console.error("Error:", err));
