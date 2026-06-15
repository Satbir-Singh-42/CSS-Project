// Converts HSL to HEX
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

export function generatePalette() {
    // Random base hue (0-360)
    const h = Math.floor(Math.random() * 360);
    // Random saturation (50-100 for colorfulness)
    const s = Math.floor(Math.random() * 50) + 50;
    // Random lightness (40-80 to avoid pure black or pure white)
    const l = Math.floor(Math.random() * 40) + 40;

    // Pick a random color theory rule
    const theory = Math.floor(Math.random() * 3);
    let hues = [];

    if (theory === 0) {
        // Analogous: colors next to each other on the wheel
        hues = [h, (h + 30) % 360, (h + 60) % 360, (h + 90) % 360];
    } else if (theory === 1) {
        // Triadic: evenly spaced around the wheel
        hues = [h, (h + 120) % 360, (h + 240) % 360, (h + 60) % 360];
    } else {
        // Complementary split: opposite side of the wheel
        hues = [h, (h + 150) % 360, (h + 180) % 360, (h + 210) % 360];
    }

    // Convert all Hues to HEX using our base saturation and lightness
    const colors = hues.map(hue => hslToHex(hue, s, l));

    // Determine a rough categorical tag
    let tag = 'Vibrant';
    if (l > 75) tag = 'Pastel';
    else if (l < 45) tag = 'Dark';
    else if (s < 60) tag = 'Vintage';
    else if (h >= 0 && h <= 60) tag = 'Warm';
    else if (h >= 180 && h <= 300) tag = 'Cold';
    else tag = 'Neon';

    return { colors, tag, likes: 0 };
}
