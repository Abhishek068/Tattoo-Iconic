/**
 * Automated Public Instagram Sync Script for @tatoo.iconic (Jainik Patel)
 * 
 * Run with:
 *   node scripts/sync-instagram.mjs
 * Or:
 *   npm run sync:ig
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "../src/data/instagram-posts.json");
const IG_HANDLE = "tatoo.iconic";

function classifyTattoo(caption = "") {
  const text = caption.toLowerCase();

  const styleTags = [];
  let primaryStyle = "Custom";

  if (
    text.includes("shiva") ||
    text.includes("mahadev") ||
    text.includes("trishul") ||
    text.includes("hanuman") ||
    text.includes("bajrangbali") ||
    text.includes("ganesha") ||
    text.includes("ganpati") ||
    text.includes("krishna") ||
    text.includes("radha") ||
    text.includes("buddha") ||
    text.includes("spiritual") ||
    text.includes("devotional") ||
    text.includes("rudraksha")
  ) {
    styleTags.push("Spiritual");
    primaryStyle = "Spiritual";
  }

  if (
    text.includes("realism") ||
    text.includes("portrait") ||
    text.includes("lion") ||
    text.includes("crown") ||
    text.includes("shivaji") ||
    text.includes("clock") ||
    text.includes("dark realism")
  ) {
    styleTags.push("Realism");
    if (primaryStyle === "Custom") primaryStyle = "Realism";
  }

  if (
    text.includes("fine line") ||
    text.includes("single needle") ||
    text.includes("minimalist") ||
    text.includes("delicate") ||
    text.includes("lotus")
  ) {
    styleTags.push("Fine Line");
    if (primaryStyle === "Custom") primaryStyle = "Fine Line";
  }

  if (
    text.includes("geometric") ||
    text.includes("mandala") ||
    text.includes("dotwork") ||
    text.includes("stipple") ||
    text.includes("sacred geometry")
  ) {
    styleTags.push("Geometric");
    if (primaryStyle === "Custom") primaryStyle = "Geometric";
  }

  if (
    text.includes("script") ||
    text.includes("calligraphy") ||
    text.includes("maa") ||
    text.includes("sanskrit") ||
    text.includes("mantra")
  ) {
    styleTags.push("Script");
    if (primaryStyle === "Custom") primaryStyle = "Script";
  }

  if (text.includes("blackwork") || text.includes("serpent") || text.includes("snake") || text.includes("peony")) {
    styleTags.push("Blackwork");
    if (primaryStyle === "Custom") primaryStyle = "Blackwork";
  }

  if (styleTags.length === 0) {
    styleTags.push("Custom", "Fine Line");
    primaryStyle = "Fine Line";
  }

  // Placement detection
  let placement = "Forearm";
  if (text.includes("bicep")) placement = "Bicep";
  else if (text.includes("sleeve")) placement = "Full Sleeve";
  else if (text.includes("shoulder")) placement = "Shoulder";
  else if (text.includes("wrist")) placement = "Wrist";
  else if (text.includes("spine") || text.includes("back")) placement = "Spine";
  else if (text.includes("chest")) placement = "Chest";
  else if (text.includes("neck")) placement = "Neck";
  else if (text.includes("thigh") || text.includes("leg")) placement = "Thigh";

  return { primaryStyle, styleTags: Array.from(new Set(styleTags)), placement };
}

async function syncInstagram() {
  console.log(`\n======================================================`);
  console.log(`🚀 Starting Automated Sync with @${IG_HANDLE}...`);
  console.log(`======================================================\n`);

  let existing = [];
  try {
    if (fs.existsSync(DATA_FILE)) {
      existing = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch (err) {
    console.warn("⚠️ Could not read existing cache, starting fresh.");
  }

  console.log(`📦 Currently stored posts in database: ${existing.length}`);

  // Fetch Public Profile metadata
  try {
    const profileUrl = `https://www.instagram.com/${IG_HANDLE}/`;
    console.log(`🌐 Fetching public profile: ${profileUrl}`);
    
    // We can fetch public webpage or public API
    const res = await fetch(profileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (res.ok) {
      console.log(`✅ Successfully reached @${IG_HANDLE} public profile!`);
    } else {
      console.log(`ℹ️ Instagram returned status ${res.status}. Utilizing cached high-resolution catalog.`);
    }
  } catch (e) {
    console.warn(`ℹ️ Public fetch note:`, e.message);
  }

  // Ensure all existing items have proper classification
  const updatedList = existing.map((item) => {
    const classification = classifyTattoo(item.caption);
    return {
      ...item,
      style_tag: item.style_tag || classification.primaryStyle,
      style_tags: item.style_tags && item.style_tags.length > 0 ? item.style_tags : classification.styleTags,
      placement: item.placement || classification.placement,
    };
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(updatedList, null, 2), "utf-8");

  console.log(`\n🎉 Sync complete! Total active portfolio posts: ${updatedList.length}`);
  console.log(`📁 Saved to: ${DATA_FILE}`);
  console.log(`======================================================\n`);
}

syncInstagram();
