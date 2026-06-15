import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

globalThis.WebSocket = WebSocket;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePaletteForTag(tag) {
  let s, l;
  let h = Math.floor(Math.random() * 360);

  // Set Saturation and Lightness strictly according to the requested theme
  if (tag === 'Pastel') {
    s = Math.floor(Math.random() * 40) + 40; // 40-80
    l = Math.floor(Math.random() * 15) + 75; // 75-90
  } else if (tag === 'Vintage') {
    s = Math.floor(Math.random() * 30) + 20; // 20-50
    l = Math.floor(Math.random() * 30) + 40; // 40-70
    if (Math.random() > 0.5) h = Math.floor(Math.random() * 60);
  } else if (tag === 'Retro') {
    s = Math.floor(Math.random() * 40) + 60; // 60-100
    l = Math.floor(Math.random() * 20) + 45; // 45-65
    const retroHues = [15, 30, 45, 180, 210];
    h = retroHues[Math.floor(Math.random() * retroHues.length)];
  } else if (tag === 'Neon') {
    s = Math.floor(Math.random() * 20) + 80; // 80-100
    l = Math.floor(Math.random() * 15) + 45; // 45-60
  } else if (tag === 'Dark') {
    s = Math.floor(Math.random() * 50) + 30; // 30-80
    l = Math.floor(Math.random() * 15) + 15; // 15-30
  } else if (tag === 'Warm') {
    s = Math.floor(Math.random() * 60) + 40; // 40-100
    l = Math.floor(Math.random() * 40) + 30; // 30-70
    h = Math.floor(Math.random() * 60); // 0-60 (Reds, Oranges, Yellows)
  } else if (tag === 'Cold') {
    s = Math.floor(Math.random() * 60) + 40; // 40-100
    l = Math.floor(Math.random() * 40) + 30; // 30-70
    h = Math.floor(Math.random() * 120) + 180; // 180-300 (Cyans, Blues, Purples)
  }

  // Generate EXACTLY 5 colors
  const theory = Math.floor(Math.random() * 4);
  let hues = [];

  if (theory === 0) { // Analogous
    hues = [h, (h + 20) % 360, (h + 40) % 360, (h + 60) % 360, (h + 80) % 360];
  } else if (theory === 1) { // Triadic + 2 analogous
    hues = [h, (h + 120) % 360, (h + 240) % 360, (h + 15) % 360, (h + 135) % 360];
  } else if (theory === 2) { // Complementary split with shades
    hues = [h, (h + 150) % 360, (h + 210) % 360, (h + 30) % 360, (h + 180) % 360];
  } else { // Monochromatic
    hues = [h, h, h, h, h];
  }

  // Convert to HEX with some slight lightness variation for texture
  const colors = hues.map((hue, idx) => {
    let finalL = l;
    if (theory === 3) {
      // Heavy lightness variation for monochromatic
      finalL = Math.max(15, Math.min(85, l + (idx * 15 - 30)));
    } else {
      // Tiny lightness variation for others
      finalL = Math.max(10, Math.min(90, l + (Math.floor(Math.random() * 20) - 10)));
    }
    return hslToHex(hue, s, finalL);
  });

  const likes = Math.floor(Math.random() * 5000);
  return { colors, tag, likes };
}

async function run() {
  console.log("🗑️ Deleting all existing palettes...");
  await supabase.from('palettes').delete().gt('id', -1);

  const requiredTags = ['Pastel', 'Vintage', 'Retro', 'Neon', 'Dark', 'Warm', 'Cold'];
  const targetPerTag = Math.ceil(500 / requiredTags.length);

  const finalPalettes = [];

  console.log("🎨 Generating 500 strictly categorized 5-color palettes...");
  for (const tag of requiredTags) {
    for (let i = 0; i < targetPerTag; i++) {
      if (finalPalettes.length < 500) {
        finalPalettes.push(generatePaletteForTag(tag));
      }
    }
  }

  console.log("💾 Inserting into database in batches...");
  for (let i = 0; i < 500; i += 100) {
    const batch = finalPalettes.slice(i, i + 100);
    const { error } = await supabase.from('palettes').insert(batch);
    if (error) console.error("❌ Batch error:", error);
  }

  console.log("✅ Done! Database is perfectly seeded with 500 5-color palettes.");
}

run();
