import fs from "fs";

const options = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
  }
};

fetch("https://www.instagram.com/tatoo.iconic/", options)
  .then(res => res.text())
  .then(html => {
    const regex = /<script type="application\/json"[^>]*>(.*?)<\/script>/gs;
    let match;
    let extractedPosts = [];

    while ((match = regex.exec(html)) !== null) {
      const content = match[1];
      try {
        const parsed = JSON.parse(content);
        
        // Search recursively for timeline / media items
        function findItems(obj) {
          if (!obj || typeof obj !== "object") return;
          
          if (obj.shortcode || (obj.id && obj.display_url)) {
            extractedPosts.push(obj);
          }

          if (obj.xdt_api__v1__feed__user_timeline_graphql_connection) {
            const edges = obj.xdt_api__v1__feed__user_timeline_graphql_connection.edges || [];
            edges.forEach(e => extractedPosts.push(e.node || e));
          }

          if (obj.edge_owner_to_timeline_media) {
            const edges = obj.edge_owner_to_timeline_media.edges || [];
            edges.forEach(e => extractedPosts.push(e.node || e));
          }

          for (const key of Object.keys(obj)) {
            findItems(obj[key]);
          }
        }

        findItems(parsed);
      } catch (e) {
        // ignore parse errors
      }
    }

    console.log(`Found ${extractedPosts.length} raw post objects in Instagram HTML!`);
    
    // Deduplicate and inspect first 5
    const uniquePosts = [];
    const seen = new Set();
    for (const p of extractedPosts) {
      const id = p.id || p.shortcode || p.pk;
      if (id && !seen.has(id)) {
        seen.add(id);
        uniquePosts.push(p);
      }
    }

    console.log(`Unique posts: ${uniquePosts.length}`);
    if (uniquePosts.length > 0) {
      fs.writeFileSync("scripts/raw_ig_sample.json", JSON.stringify(uniquePosts.slice(0, 10), null, 2));
      console.log("Saved sample to scripts/raw_ig_sample.json");
    }
  })
  .catch(err => console.error("Error:", err));
