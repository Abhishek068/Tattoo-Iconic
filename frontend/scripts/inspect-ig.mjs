import fs from "fs";

const options = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  }
};

fetch("https://www.instagram.com/tatoo.iconic/", options)
  .then(res => res.text())
  .then(html => {
    const regex = /<script type="application\/json"[^>]*>(.*?)<\/script>/gs;
    let match;
    let count = 0;
    while ((match = regex.exec(html)) !== null) {
      count++;
      try {
        const parsed = JSON.parse(match[1]);
        const keys = Object.keys(parsed);
        const str = JSON.stringify(parsed);
        if (str.length > 5000) {
          console.log(`Script ${count}: keys = [${keys.join(", ")}], length = ${str.length}`);
          if (str.includes("items") || str.includes("media") || str.includes("image") || str.includes("url")) {
            console.log(`  -> contains media keywords!`);
            // Check sample matches
            const urls = str.match(/https:\/\/[^"'\\]+cdninstagram\.com[^"'\\]+/g) || [];
            console.log(`  -> found ${urls.length} cdninstagram urls!`);
            if (urls.length > 0) {
              console.log(`  -> Sample URL: ${urls[0]}`);
            }
          }
        }
      } catch (e) {}
    }
  });
